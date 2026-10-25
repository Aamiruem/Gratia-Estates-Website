"""One-time owner verification codes, sent by email.

Configure email delivery in the backend config (e.g. a Gmail account with an
App Password):

    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=you@gmail.com
    SMTP_PASSWORD=your-16-character-app-password
    SMTP_FROM=Gratia Estates <you@gmail.com>

SMS codes go through Twilio. In local development (COOKIE_SECURE=false), if SMTP
or Twilio is not configured, the code is written to the backend terminal instead.
"""

import hashlib
import hmac
import logging
import os
import secrets
import smtplib
import base64
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from email.message import EmailMessage

from . import config  # noqa: F401
from .security import JWT_SECRET_KEY

logger = logging.getLogger("gratia.otp")

CODE_TTL_MINUTES = 10
MAX_ATTEMPTS = 5
RESEND_AFTER_SECONDS = 30


def smtp_configured() -> bool:
    try:
        port = int(os.getenv("SMTP_PORT", "587"))
    except ValueError:
        return False
    return bool(
        os.getenv("SMTP_HOST", "").strip()
        and os.getenv("SMTP_USER", "").strip()
        and os.getenv("SMTP_PASSWORD", "").strip()
        and 1 <= port <= 65535
    )


def console_fallback_enabled() -> bool:
    """Local development only: without SMTP, show codes in the backend terminal.
    Defaults on when cookies are not secure (i.e. not served over HTTPS)."""
    insecure = os.getenv("COOKIE_SECURE", "false").lower() != "true"
    default = "true" if insecure else "false"
    return os.getenv("OTP_CONSOLE_FALLBACK", default).lower() == "true"


def email_otp_available() -> bool:
    return smtp_configured() or console_fallback_enabled()


def new_code() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_code(challenge_id: str, code: str) -> str:
    # Keyed hash: a leaked database row cannot be brute-forced offline.
    message = f"{challenge_id}:{code}".encode()
    return hmac.new(JWT_SECRET_KEY.encode(), message, hashlib.sha256).hexdigest()


def codes_match(stored_hash: str, challenge_id: str, code: str) -> bool:
    return hmac.compare_digest(stored_hash, hash_code(challenge_id, code))


def mask_email(email: str) -> str:
    name, _, domain = email.partition("@")
    visible = name[:2] if len(name) > 2 else name[:1]
    return f"{visible}{'*' * max(len(name) - len(visible), 2)}@{domain}"


def twilio_configured() -> bool:
    return bool(
        os.getenv("TWILIO_ACCOUNT_SID", "").strip()
        and os.getenv("TWILIO_AUTH_TOKEN", "").strip()
        and (
            os.getenv("TWILIO_FROM_NUMBER", "").strip()
            or os.getenv("TWILIO_MESSAGING_SERVICE_SID", "").strip()
        )
    )


def phone_otp_available() -> bool:
    return bool(os.getenv("OWNER_PHONE_NUMBER", "").strip()) and (
        twilio_configured() or console_fallback_enabled()
    )


def push_configured() -> bool:
    return bool(os.getenv("NTFY_TOPIC", "").strip())


def send_push_code(code: str, purpose: str) -> bool:
    """Sends the code as a phone notification through ntfy (https://ntfy.sh).
    The topic name is a long random secret; the owner subscribes to it in the ntfy app."""
    topic = os.getenv("NTFY_TOPIC", "").strip()
    if not topic:
        return False
    server = os.getenv("NTFY_SERVER", "https://ntfy.sh").rstrip("/")
    request = Request(
        f"{server}/{topic}",
        data=f"{code} is your Gratia Estates {purpose} code. It expires in {CODE_TTL_MINUTES} minutes.".encode(),
        headers={"Title": f"Gratia Estates {purpose} code", "Priority": "high", "Tags": "lock"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=10) as response:
            return response.status < 300
    except (HTTPError, URLError):
        logger.exception("Could not send the owner code notification")
        return False


def _log_code(recipient: str, code: str, purpose: str) -> str:
    """Fallback when SMTP/Twilio are not configured: push the code to the owner's
    phone through ntfy if set up, and always keep a copy in a private local file."""
    pushed = send_push_code(code, purpose)
    try:
        code_file = config.LOCAL_CONFIG_DIR / "latest_otp.txt"
        code_file.parent.mkdir(parents=True, exist_ok=True)
        code_file.write_text(f"{purpose} code for {recipient}: {code} (valid {CODE_TTL_MINUTES} min)\n")
    except OSError:
        logger.exception("Could not write the local OTP file")
    logger.warning(
        "Delivery is not configured. Owner %s code for %s: %s (valid %s minutes)",
        purpose,
        recipient,
        code,
        CODE_TTL_MINUTES,
    )
    print(f"\n*** Gratia owner {purpose} code for {recipient}: {code} (valid {CODE_TTL_MINUTES} min) ***\n", flush=True)
    return "push" if pushed else "log"


def mask_phone(phone: str) -> str:
    digits = "".join(character for character in phone if character.isdigit())
    return f"******{digits[-4:]}" if digits else "configured phone"


def send_sms_code(phone: str, code: str, purpose: str = "sign-in") -> str:
    """Sends the code by SMS. Returns "sms" or "log" depending on how it was delivered."""
    account_sid = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
    auth_token = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
    messaging_service_sid = os.getenv("TWILIO_MESSAGING_SERVICE_SID", "").strip()
    from_number = os.getenv("TWILIO_FROM_NUMBER", "").strip()
    if not (account_sid and auth_token and (messaging_service_sid or from_number)):
        if not console_fallback_enabled():
            raise RuntimeError("Phone verification is unavailable because Twilio is not configured.")
        return _log_code(mask_phone(phone), code, purpose)

    fields = {"To": phone, "Body": f"Your Gratia Estates {purpose} code is {code}. It expires in {CODE_TTL_MINUTES} minutes."}
    if messaging_service_sid:
        fields["MessagingServiceSid"] = messaging_service_sid
    else:
        fields["From"] = from_number
    payload = urlencode(fields).encode("ascii")
    credentials = base64.b64encode(f"{account_sid}:{auth_token}".encode("ascii")).decode("ascii")
    request = Request(
        f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json",
        data=payload,
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=15) as response:
            if response.status >= 300:
                raise RuntimeError(f"SMS provider returned HTTP {response.status}.")
    except HTTPError as error:
        logger.error("SMS provider rejected the owner verification message (HTTP %s).", error.code)
        raise RuntimeError("The SMS provider could not send the verification code.") from error
    except URLError as error:
        logger.error("Could not reach the SMS provider.")
        raise RuntimeError("Could not reach the SMS provider.") from error
    return "sms"


def send_code(email: str, code: str, purpose: str = "sign-in") -> str:
    """Sends the code. Returns "email" or "log" depending on how it was delivered.
    `purpose` is included in the message subject and body."""
    host = os.getenv("SMTP_HOST", "").strip()
    user = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()

    if not (host and user and password):
        if not console_fallback_enabled():
            raise RuntimeError("Email verification is unavailable because SMTP is not configured.")
        return _log_code(email, code, purpose)

    warning = {
        "sign-in": "If you didn't try to sign in, please change your password.",
        "password reset": "If you didn't ask to reset your password, you can ignore this email.",
        "email change": "If you didn't request an email change, secure your account immediately.",
    }.get(purpose, "If you didn't request this code, you can ignore this email.")
    message = EmailMessage()
    message["Subject"] = f"{code} is your Gratia Estates {purpose} code"
    message["From"] = os.getenv("SMTP_FROM", user)
    message["To"] = email
    message.set_content(
        f"Your Gratia Estates owner {purpose} code is: {code}\n\n"
        f"It expires in {CODE_TTL_MINUTES} minutes. {warning}"
    )
    message.add_alternative(
        f"""<div style="font-family:Arial,sans-serif;max-width:440px;margin:auto;padding:24px;border:1px solid #e7e2d8;border-radius:16px">
<p style="color:#80602b;font-size:12px;letter-spacing:2px;font-weight:bold;margin:0">GRATIA ESTATES</p>
<h2 style="color:#142536;margin:8px 0 16px">Your {purpose} code</h2>
<p style="font-size:34px;letter-spacing:10px;font-weight:bold;color:#142536;background:#f7f4ed;border-radius:12px;padding:14px;text-align:center;margin:0">{code}</p>
<p style="color:#5e6872;font-size:14px;margin-top:16px">This code expires in {CODE_TTL_MINUTES} minutes. {warning}</p>
</div>""",
        subtype="html",
    )
    port = int(os.getenv("SMTP_PORT", "587"))
    with smtplib.SMTP(host, port, timeout=15) as smtp:
        smtp.starttls()
        smtp.login(user, password)
        smtp.send_message(message)
    return "email"
