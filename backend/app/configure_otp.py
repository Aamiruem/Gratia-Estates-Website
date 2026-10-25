"""Configure private SMTP and Twilio settings for owner OTP delivery."""

import base64
import getpass
import re
import smtplib
import ssl
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import dotenv_values, set_key

from .config import LOCAL_CONFIG_FILE


def _test_smtp(host: str, port: int, username: str, password: str) -> None:
    try:
        if port == 465:
            with smtplib.SMTP_SSL(
                host, port, timeout=15, context=ssl.create_default_context()
            ) as smtp:
                smtp.login(username, password)
        else:
            with smtplib.SMTP(host, port, timeout=15) as smtp:
                smtp.ehlo()
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
                smtp.login(username, password)
    except (OSError, smtplib.SMTPException) as error:
        raise ValueError(
            "SMTP connection or login failed. Check the host, port, username, "
            "password/app password, and provider security settings."
        ) from error


def _test_twilio(account_sid: str, auth_token: str) -> None:
    credentials = base64.b64encode(
        f"{account_sid}:{auth_token}".encode("ascii")
    ).decode("ascii")
    request = Request(
        f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}.json",
        headers={"Authorization": f"Basic {credentials}"},
        method="GET",
    )
    try:
        with urlopen(request, timeout=15) as response:
            if response.status != 200:
                raise ValueError(
                    f"Twilio credential check returned HTTP {response.status}."
                )
    except HTTPError as error:
        raise ValueError(
            f"Twilio credential check failed (HTTP {error.code}). Check the Account SID and Auth Token."
        ) from error
    except URLError as error:
        raise ValueError(
            "Could not reach Twilio. Check the network connection and try again."
        ) from error


def _setting(prompt: str, current: str | None = None) -> str:
    while True:
        suffix = " [configured]" if current else ""
        value = input(f"{prompt}{suffix}: ").strip()
        if value:
            return value
        if current:
            return current
        print("This value is required.")


def _secret(prompt: str, current: str | None = None) -> str:
    while True:
        suffix = " [press Enter to keep configured value]" if current else ""
        value = getpass.getpass(f"{prompt}{suffix}: ").strip()
        if value:
            return value
        if current:
            return current
        print("This value is required.")


def _save_values(config_file: Path, values: dict[str, str]) -> None:
    config_file.parent.mkdir(parents=True, exist_ok=True)
    config_file.touch(exist_ok=True)
    for key, value in values.items():
        set_key(str(config_file), key, value, quote_mode="always")


def gmail_password_only() -> None:
    """Shortcut: SMTP settings are already saved, only the Gmail App Password is asked for."""
    current = dotenv_values(LOCAL_CONFIG_FILE)
    user = current.get("SMTP_USER")
    if not user:
        raise ValueError("No Gmail address is saved yet. Run: python -m app.configure_otp")
    print(f"Gmail account: {user}")
    print("Create an App Password at https://myaccount.google.com/apppasswords")
    password = _secret("Paste the 16-character Gmail App Password").replace(" ", "")
    _test_smtp(current.get("SMTP_HOST") or "smtp.gmail.com", int(current.get("SMTP_PORT") or 587), user, password)
    _save_values(LOCAL_CONFIG_FILE, {"SMTP_PASSWORD": password})
    print("Gmail login verified and saved. Restart the backend; codes will now arrive by email.")


def main() -> None:
    current = dotenv_values(LOCAL_CONFIG_FILE)
    print("Configure OTP delivery in the private backend settings.")
    print("Values are saved locally and secrets are not displayed.")
    print(f"Config file: {LOCAL_CONFIG_FILE}")
    values: dict[str, str] = {}
    configure_email = input("\nConfigure email OTP (Gmail) now? [y/N]: ").strip().lower()
    if configure_email in {"y", "yes"}:
        print("\nEmail (SMTP)")
        smtp_host = _setting(
            "SMTP host (press Enter for Gmail, smtp.gmail.com)",
            current.get("SMTP_HOST") or "smtp.gmail.com",
        )
        smtp_port = _setting("SMTP port", current.get("SMTP_PORT") or "587")
        if not smtp_port.isdigit() or not 1 <= int(smtp_port) <= 65535:
            raise ValueError("SMTP port must be a number between 1 and 65535.")
        smtp_user = _setting("SMTP account email / username", current.get("SMTP_USER"))
        smtp_password = _secret("SMTP password or email app password", current.get("SMTP_PASSWORD"))
        smtp_from = _setting("From address", current.get("SMTP_FROM") or smtp_user)
        _test_smtp(smtp_host, int(smtp_port), smtp_user, smtp_password)
        print("SMTP login verified.")
        values.update(
            {
                "SMTP_HOST": smtp_host,
                "SMTP_PORT": smtp_port,
                "SMTP_USER": smtp_user,
                "SMTP_PASSWORD": smtp_password,
                "SMTP_FROM": smtp_from,
            }
        )
    configure_sms = input("\nConfigure mobile SMS OTP with Twilio now? [y/N]: ").strip().lower()
    if configure_sms in {"y", "yes"}:
        print("\nSMS (Twilio)")
        owner_phone = _setting(
            "Owner phone number in international format, e.g. +15551234567",
            current.get("OWNER_PHONE_NUMBER"),
        )
        if not re.fullmatch(r"\+[1-9]\d{7,14}", owner_phone):
            raise ValueError("Owner phone must use international E.164 format, e.g. +15551234567.")
        account_sid = _setting("Twilio Account SID", current.get("TWILIO_ACCOUNT_SID"))
        if not re.fullmatch(r"AC[0-9a-fA-F]{32}", account_sid):
            raise ValueError("Twilio Account SID must start with AC and contain 32 hexadecimal characters.")
        auth_token = _secret("Twilio Auth Token", current.get("TWILIO_AUTH_TOKEN"))
        existing_sender = current.get("TWILIO_MESSAGING_SERVICE_SID") or current.get("TWILIO_FROM_NUMBER")
        sender = _setting("Twilio sender phone number or Messaging Service SID", existing_sender)
        if sender.startswith("MG"):
            if not re.fullmatch(r"MG[0-9a-fA-F]{32}", sender):
                raise ValueError("Twilio Messaging Service SID must start with MG and contain 32 hexadecimal characters.")
            from_number = ""
            messaging_service_sid = sender
        else:
            if not re.fullmatch(r"\+[1-9]\d{7,14}", sender):
                raise ValueError("Twilio sender phone must use international E.164 format, e.g. +15557654321.")
            from_number = sender
            messaging_service_sid = ""
        _test_twilio(account_sid, auth_token)
        print("Twilio credentials verified.")
        values.update(
            {
                "OWNER_PHONE_NUMBER": owner_phone,
                "TWILIO_ACCOUNT_SID": account_sid,
                "TWILIO_AUTH_TOKEN": auth_token,
                "TWILIO_FROM_NUMBER": from_number,
                "TWILIO_MESSAGING_SERVICE_SID": messaging_service_sid,
            }
        )

    if not values:
        print("\nNothing was configured. Run this setup again when you are ready.")
        return
    _save_values(LOCAL_CONFIG_FILE, values)
    print("\nSaved:", ", ".join(
        name for name, chosen in (("email OTP", configure_email), ("mobile SMS OTP", configure_sms))
        if chosen in {"y", "yes"}
    ))
    print("Restart the backend to load them, then refresh the sign-in page.")


if __name__ == "__main__":
    import sys

    try:
        gmail_password_only() if sys.argv[1:] == ["gmail"] else main()
    except ValueError as error:
        raise SystemExit(str(error)) from error
