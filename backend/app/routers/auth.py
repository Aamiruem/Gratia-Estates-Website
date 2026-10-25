import logging
import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from jose import JWTError
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import delete, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import config  # noqa: F401
from .. import otp
from ..database import get_db
from ..dependencies import ACCESS_COOKIE, REFRESH_COOKIE, get_current_user
from ..models import (
    EmailChangeChallenge,
    LoginChallenge,
    User,
)
from ..schemas import AuthResponse, LoginRequest, UserResponse
from ..security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger("gratia.auth")

COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax")
VIDEO_ADMIN_EMAIL = os.getenv("VIDEO_ADMIN_EMAIL", "").strip().lower()


def is_video_admin(user: User) -> bool:
    return user.role == "video_admin" or bool(
        VIDEO_ADMIN_EMAIL and user.email.lower() == VIDEO_ADMIN_EMAIL
    )


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key=ACCESS_COOKIE,
        value=access_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=60 * ACCESS_TOKEN_EXPIRE_MINUTES,
        path="/",
    )
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=60 * 60 * 24 * REFRESH_TOKEN_EXPIRE_DAYS,
        path="/auth/refresh",
    )


def clear_auth_cookies(response: Response):
    response.delete_cookie(key=ACCESS_COOKIE, path="/")
    response.delete_cookie(key=REFRESH_COOKIE, path="/auth/refresh")


PHONE_PREFIX = "phone_"


def _issue_challenge(
    user: User,
    db: Session,
    channel: str = "email",
    show_code: bool = False,
) -> dict:
    """Creates a one-time code for the user, sends it and returns the challenge info."""
    db.execute(delete(LoginChallenge).where(LoginChallenge.user_id == user.id))
    prefix = PHONE_PREFIX if channel == "phone" else ""
    challenge_id = prefix + secrets.token_urlsafe(32)
    code = otp.new_code()
    db.add(
        LoginChallenge(
            id=challenge_id,
            user_id=user.id,
            code_hash=otp.hash_code(challenge_id, code),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=otp.CODE_TTL_MINUTES),
        )
    )
    db.flush()
    recipient = user.email
    delivered_via = channel
    try:
        if channel == "phone":
            phone = os.getenv("OWNER_PHONE_NUMBER", "").strip()
            delivered_via = otp.send_sms_code(phone, code, "sign-in")
            recipient = otp.mask_phone(phone)
        else:
            delivered_via = otp.send_code(user.email, code, "sign-in")
    except Exception:
        logger.exception("Could not send the owner verification code")
        db.rollback()
        raise HTTPException(
            status_code=502,
            detail="We couldn't send your verification code. Please check the configured delivery service and try again.",
        )
    db.commit()
    reply = {
        "otp_required": True,
        "challenge_id": challenge_id,
        "sent_to": otp.mask_email(recipient) if channel == "email" else recipient,
        "channel": channel,
        "delivered_via": delivered_via,
        "expires_in_minutes": otp.CODE_TTL_MINUTES,
        "resend_after_seconds": otp.RESEND_AFTER_SECONDS,
    }
    # Local test mode only: no real email/SMS was sent and the request comes from
    # this computer, so showing the code is no weaker than the local code file.
    if show_code and delivered_via in {"log", "push"}:
        reply["local_code"] = code
    return reply


def _is_local_request(request: Request) -> bool:
    host = request.client.host if request.client else ""
    return otp.console_fallback_enabled() and host in {"127.0.0.1", "::1", "localhost"}


def _complete_login(user: User, response: Response) -> AuthResponse:
    set_auth_cookies(response, create_access_token(user.id), create_refresh_token(user.id))
    return AuthResponse(message="Login successful", user=user, is_video_admin=is_video_admin(user))


def _find_owner(db: Session) -> User | None:
    """Returns the video owner, creating it from VIDEO_ADMIN_EMAIL on first use."""
    owner = db.scalar(select(User).where(User.role == "video_admin").order_by(User.id))
    if owner is None and VIDEO_ADMIN_EMAIL:
        owner = db.scalar(select(User).where(func.lower(User.email) == VIDEO_ADMIN_EMAIL))
        if owner is None:
            # Sign-in is OTP-only, so this password is random and never used.
            owner = User(
                name="Owner",
                email=VIDEO_ADMIN_EMAIL,
                password_hash=hash_password(secrets.token_urlsafe(32)),
                role="video_admin",
            )
            db.add(owner)
            db.commit()
            db.refresh(owner)
    return owner


def _last_digits(phone: str | None) -> str:
    # Compare the last 10 digits so "+91 98xxxxxxxx" and "98xxxxxxxx" both match.
    return "".join(character for character in phone or "" if character.isdigit())[-10:]


@router.post("/login")
def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    """Step 1: send a one-time code to the owner's email or mobile number."""
    owner = _find_owner(db)
    if data.otp_channel == "phone":
        owner_phone = os.getenv("OWNER_PHONE_NUMBER", "").strip()
        if not otp.phone_otp_available():
            raise HTTPException(status_code=503, detail="Mobile OTP is not configured.")
        if not data.phone or _last_digits(data.phone) != _last_digits(owner_phone):
            raise HTTPException(status_code=401, detail="This mobile number is not registered as the owner.")
    else:
        email = (data.email or "").lower().strip()
        if not email:
            raise HTTPException(status_code=422, detail="Enter your owner email address.")
        if not otp.email_otp_available():
            raise HTTPException(status_code=503, detail="Email OTP is not configured.")
        if owner is None or owner.email.lower() != email:
            raise HTTPException(status_code=401, detail="This email is not registered as the owner.")

    if owner is None:
        raise HTTPException(status_code=503, detail="No owner account is configured. Set VIDEO_ADMIN_EMAIL in the backend settings.")
    if not owner.is_active:
        raise HTTPException(status_code=403, detail="User account is inactive")
    return _issue_challenge(owner, db, channel=data.otp_channel, show_code=_is_local_request(request))


@router.get("/otp/options")
def otp_options():
    configured_phone = os.getenv("OWNER_PHONE_NUMBER", "").strip()
    local_hint = (
        "Code sent to your phone (ntfy app)" if otp.push_configured()
        else "Local mode · code shown in backend terminal"
    )
    return {
        "email": otp.email_otp_available(),
        "email_hint": (
            None if otp.smtp_configured()
            else local_hint if otp.email_otp_available()
            else "Email delivery is not configured"
        ),
        "phone": otp.phone_otp_available(),
        "phone_hint": (
            None if otp.twilio_configured() or not otp.phone_otp_available()
            else local_hint
        ) if configured_phone else "Owner mobile number is not configured",
    }


class OtpVerifyRequest(BaseModel):
    challenge_id: str = Field(min_length=10, max_length=64)
    code: str = Field(pattern=r"^\d{6}$")


class OtpResendRequest(BaseModel):
    challenge_id: str = Field(min_length=10, max_length=64)


class EmailChangeStartRequest(BaseModel):
    email: EmailStr


class EmailChangeVerifyRequest(BaseModel):
    challenge_id: str = Field(min_length=10, max_length=64)
    code: str = Field(pattern=r"^\d{6}$")


@router.post("/email/change/start")
def start_email_change(
    data: EmailChangeStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not is_video_admin(current_user):
        raise HTTPException(status_code=403, detail="Only the video owner can change this email.")

    new_email = data.email.lower().strip()
    if new_email == current_user.email.lower():
        raise HTTPException(status_code=400, detail="Enter a different email address.")
    existing = db.scalar(select(User).where(func.lower(User.email) == new_email))
    if existing and existing.id != current_user.id:
        raise HTTPException(status_code=409, detail="An account already uses that email address.")

    previous_challenge = db.scalar(
        select(EmailChangeChallenge)
        .where(EmailChangeChallenge.user_id == current_user.id)
        .order_by(EmailChangeChallenge.sent_at.desc())
    )
    if previous_challenge:
        sent_at = previous_challenge.sent_at
        if sent_at.tzinfo is None:
            sent_at = sent_at.replace(tzinfo=timezone.utc)
        wait = otp.RESEND_AFTER_SECONDS - (
            datetime.now(timezone.utc) - sent_at
        ).total_seconds()
        if wait > 0:
            raise HTTPException(
                status_code=429,
                detail=f"Please wait {int(wait) + 1} seconds before requesting another code.",
            )
        db.delete(previous_challenge)

    challenge_id = secrets.token_urlsafe(32)
    code = otp.new_code()
    challenge = EmailChangeChallenge(
        id=challenge_id,
        user_id=current_user.id,
        new_email=new_email,
        code_hash=otp.hash_code(challenge_id, code),
        expires_at=datetime.now(timezone.utc)
        + timedelta(minutes=otp.CODE_TTL_MINUTES),
    )
    db.add(challenge)
    db.commit()
    try:
        otp.send_code(new_email, code, "email change")
    except Exception:
        logger.exception("Could not send the owner email-change code")
        db.delete(challenge)
        db.commit()
        raise HTTPException(
            status_code=502,
            detail="We couldn't send a verification code to that address. Please try again shortly.",
        )

    return {
        "challenge_id": challenge_id,
        "sent_to": otp.mask_email(new_email),
        "expires_in_minutes": otp.CODE_TTL_MINUTES,
        "resend_after_seconds": otp.RESEND_AFTER_SECONDS,
    }


@router.post("/email/change/verify", response_model=AuthResponse)
def verify_email_change(
    data: EmailChangeVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not is_video_admin(current_user):
        raise HTTPException(status_code=403, detail="Only the video owner can change this email.")

    challenge = db.get(EmailChangeChallenge, data.challenge_id)
    if challenge is None or challenge.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="This verification code has expired. Start again.")

    expires_at = challenge.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        db.delete(challenge)
        db.commit()
        raise HTTPException(status_code=400, detail="This verification code has expired. Start again.")

    if not otp.codes_match(challenge.code_hash, challenge.id, data.code):
        challenge.attempts += 1
        if challenge.attempts >= otp.MAX_ATTEMPTS:
            db.delete(challenge)
            db.commit()
            raise HTTPException(status_code=429, detail="Too many incorrect codes. Request a new one.")
        db.commit()
        remaining = otp.MAX_ATTEMPTS - challenge.attempts
        raise HTTPException(
            status_code=401,
            detail=f"That code isn't right. {remaining} {'try' if remaining == 1 else 'tries'} left.",
        )

    existing = db.scalar(
        select(User).where(func.lower(User.email) == challenge.new_email)
    )
    if existing and existing.id != current_user.id:
        db.delete(challenge)
        db.commit()
        raise HTTPException(status_code=409, detail="An account already uses that email address.")

    current_user.email = challenge.new_email
    current_user.role = "video_admin"
    db.delete(challenge)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="An account already uses that email address.")
    db.refresh(current_user)
    return AuthResponse(
        message="Owner email updated",
        user=current_user,
        is_video_admin=is_video_admin(current_user),
    )


def _get_challenge(challenge_id: str, db: Session) -> LoginChallenge:
    challenge = db.get(LoginChallenge, challenge_id)
    if challenge is None:
        raise HTTPException(status_code=400, detail="This sign-in code has expired. Please sign in again.")
    expires_at = challenge.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        db.delete(challenge)
        db.commit()
        raise HTTPException(status_code=400, detail="This sign-in code has expired. Please sign in again.")
    return challenge


@router.post("/login/verify", response_model=AuthResponse)
def verify_login_code(data: OtpVerifyRequest, response: Response, db: Session = Depends(get_db)):
    """Step 2: check the one-time code and start the session."""
    challenge = _get_challenge(data.challenge_id, db)

    if not otp.codes_match(challenge.code_hash, challenge.id, data.code):
        challenge.attempts += 1
        if challenge.attempts >= otp.MAX_ATTEMPTS:
            db.delete(challenge)
            db.commit()
            raise HTTPException(status_code=429, detail="Too many incorrect codes. Please sign in again.")
        db.commit()
        left = otp.MAX_ATTEMPTS - challenge.attempts
        raise HTTPException(
            status_code=401,
            detail=f"That code isn't right. {left} {'try' if left == 1 else 'tries'} left.",
        )

    user = db.get(User, challenge.user_id)
    db.delete(challenge)
    db.commit()
    if not user or not user.is_active:
        raise HTTPException(status_code=403, detail="User account is inactive")
    return _complete_login(user, response)


@router.post("/login/resend")
def resend_login_code(data: OtpResendRequest, request: Request, db: Session = Depends(get_db)):
    challenge = _get_challenge(data.challenge_id, db)
    sent_at = challenge.sent_at if challenge.sent_at.tzinfo else challenge.sent_at.replace(tzinfo=timezone.utc)
    wait = otp.RESEND_AFTER_SECONDS - (datetime.now(timezone.utc) - sent_at).total_seconds()
    if wait > 0:
        raise HTTPException(status_code=429, detail=f"Please wait {int(wait) + 1} seconds before requesting a new code.")
    user = db.get(User, challenge.user_id)
    if not user:
        raise HTTPException(status_code=400, detail="Please sign in again.")
    channel = "phone" if challenge.id.startswith(PHONE_PREFIX) else "email"
    if channel == "phone" and not otp.phone_otp_available():
        raise HTTPException(status_code=503, detail="Phone verification is not configured.")
    return _issue_challenge(user, db, channel, show_code=_is_local_request(request))


@router.post("/refresh", response_model=AuthResponse)
def refresh(response: Response, request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get(REFRESH_COOKIE)
    if not token:
        raise HTTPException(status_code=401, detail="Refresh session not found")

    try:
        user_id = decode_token(token, "refresh")
    except (JWTError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid or expired refresh session")

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User account is not active")

    access_token = create_access_token(user.id)
    new_refresh_token = create_refresh_token(user.id)
    set_auth_cookies(response, access_token, new_refresh_token)

    return AuthResponse(
        message="Session refreshed",
        user=user,
        is_video_admin=is_video_admin(user),
    )


@router.post("/logout")
def logout(response: Response):
    clear_auth_cookies(response)
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=AuthResponse)
def me(current_user: User = Depends(get_current_user)):
    return AuthResponse(
        message="Authenticated",
        user=current_user,
        is_video_admin=is_video_admin(current_user),
    )
