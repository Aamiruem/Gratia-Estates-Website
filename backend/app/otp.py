"""One-time sign-in codes for the owner, sent by email.

Configure email delivery in the backend config (e.g. a Gmail account with an
App Password):

    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=you@gmail.com
    SMTP_PASSWORD=your-16-character-app-password
    SMTP_FROM=Gratia Estates <you@gmail.com>

If SMTP is not configured, the code is written to the backend log instead, so
the owner is never locked out while email is being set up.
"""

import hashlib
import hmac
import logging
import os
import secrets
import smtplib
from email.message import EmailMessage

from . import config  # noqa: F401
from .security import JWT_SECRET_KEY

logger = logging.getLogger("gratia.otp")

CODE_TTL_MINUTES = 10
MAX_ATTEMPTS = 5
RESEND_AFTER_SECONDS = 30
OTP_ENABLED = os.getenv("OWNER_OTP", "true").lower() != "false"


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


def send_code(email: str, code: str, purpose: str = "sign-in") -> str:
    """Sends the code. Returns "email" or "log" depending on how it was delivered.
    `purpose` is "sign-in" or "password reset" and is used in the wording."""
    host = os.getenv("SMTP_HOST", "").strip()
    user = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()

    if not (host and user and password):
        logger.warning(
            "SMTP is not configured. Owner %s code for %s: %s (valid %s minutes)",
            purpose,
            email,
            code,
            CODE_TTL_MINUTES,
        )
        print(f"\n*** Gratia owner {purpose} code for {email}: {code} (valid {CODE_TTL_MINUTES} min) ***\n", flush=True)
        return "log"

    warning = (
        "If you didn't try to sign in, please change your password."
        if purpose == "sign-in"
        else "If you didn't ask to reset your password, you can ignore this email."
    )
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
