import hmac
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
from ..models import LoginChallenge, OwnerSetupState, User
from ..schemas import AuthResponse, LoginRequest, SignupRequest, UserResponse
from ..security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger("gratia.auth")

COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax")
VIDEO_ADMIN_EMAIL = os.getenv("VIDEO_ADMIN_EMAIL", "").strip().lower()
OWNER_SETUP_TOKEN = os.getenv("OWNER_SETUP_TOKEN", "")


def is_video_admin(user: User) -> bool:
    return bool(VIDEO_ADMIN_EMAIL and user.email.lower() == VIDEO_ADMIN_EMAIL)


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


@router.post("/signup", response_model=AuthResponse)
def signup(data: SignupRequest, response: Response, db: Session = Depends(get_db)):
    email = data.email.lower().strip()

    if not VIDEO_ADMIN_EMAIL:
        raise HTTPException(
            status_code=503,
            detail="Owner registration is unavailable because no owner email is configured.",
        )
    if len(OWNER_SETUP_TOKEN) < 32:
        raise HTTPException(
            status_code=503,
            detail="Owner registration is not configured. Set a secure OWNER_SETUP_TOKEN in the backend config.",
        )
    if email != VIDEO_ADMIN_EMAIL:
        raise HTTPException(
            status_code=403,
            detail="Owner registration is only available for the configured owner email.",
        )
    if not hmac.compare_digest(
        data.setup_code.encode("utf-8"), OWNER_SETUP_TOKEN.encode("utf-8")
    ):
        raise HTTPException(status_code=403, detail="Invalid owner setup code.")

    if db.get(OwnerSetupState, "owner-account-setup"):
        raise HTTPException(
            status_code=409,
            detail="Owner setup has already been completed. Sign in or reset the password locally.",
        )

    existing = db.scalar(
        select(User).where(func.lower(User.email) == VIDEO_ADMIN_EMAIL)
    )
    if existing and not existing.is_active:
        raise HTTPException(
            status_code=403,
            detail="The configured owner account is inactive. Contact the administrator.",
        )

    if existing:
        user = existing
        user.password_hash = hash_password(data.password)
    else:
        user = User(
            name=data.name.strip(),
            email=email,
            password_hash=hash_password(data.password),
            role="user",
        )
        db.add(user)
    db.add(OwnerSetupState(key="owner-account-setup"))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Owner setup has already been completed. Sign in or reset the password locally.",
        )
    db.refresh(user)

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    set_auth_cookies(response, access_token, refresh_token)

    return AuthResponse(
        message=(
            "Owner account created successfully"
            if existing is None
            else "Owner password set successfully"
        ),
        user=user,
        is_video_admin=is_video_admin(user),
    )


RESET_PREFIX = "reset_"  # marks password-reset codes so they can't be used to sign in


def _issue_challenge(user: User, db: Session, purpose: str = "login") -> dict:
    """Creates a one-time code for the user, sends it and returns the challenge info."""
    db.execute(delete(LoginChallenge).where(LoginChallenge.user_id == user.id))
    challenge_id = (RESET_PREFIX if purpose == "reset" else "") + secrets.token_urlsafe(32)
    code = otp.new_code()
    db.add(
        LoginChallenge(
            id=challenge_id,
            user_id=user.id,
            code_hash=otp.hash_code(challenge_id, code),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=otp.CODE_TTL_MINUTES),
        )
    )
    db.commit()
    try:
        otp.send_code(user.email, code, "password reset" if purpose == "reset" else "sign-in")
    except Exception:
        logger.exception("Could not send the sign-in code email")
        raise HTTPException(
            status_code=502,
            detail="We couldn't send your sign-in code. Please try again shortly.",
        )
    return {
        "otp_required": True,
        "challenge_id": challenge_id,
        "sent_to": otp.mask_email(user.email),
        "expires_in_minutes": otp.CODE_TTL_MINUTES,
        "resend_after_seconds": otp.RESEND_AFTER_SECONDS,
    }


def _complete_login(user: User, response: Response) -> AuthResponse:
    set_auth_cookies(response, create_access_token(user.id), create_refresh_token(user.id))
    return AuthResponse(message="Login successful", user=user, is_video_admin=is_video_admin(user))


@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """Step 1: check the password. Owners then receive a one-time code by email."""
    email = data.email.lower().strip()
    user = db.scalar(select(User).where(func.lower(User.email) == email))

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User account is inactive")

    if otp.OTP_ENABLED:
        return _issue_challenge(user, db)
    return _complete_login(user, response)


class OtpVerifyRequest(BaseModel):
    challenge_id: str = Field(min_length=10, max_length=64)
    code: str = Field(pattern=r"^\d{6}$")


class OtpResendRequest(BaseModel):
    challenge_id: str = Field(min_length=10, max_length=64)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    challenge_id: str = Field(min_length=10, max_length=64)
    code: str = Field(pattern=r"^\d{6}$")
    new_password: str = Field(min_length=8, max_length=128)


@router.post("/password/forgot")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Sends a reset code to the owner's email. The reply is the same whether or
    not the email belongs to the owner, so it can't be used to discover accounts."""
    email = data.email.lower().strip()
    reply = {
        "challenge_id": RESET_PREFIX + secrets.token_urlsafe(32),
        "sent_to": otp.mask_email(email),
        "expires_in_minutes": otp.CODE_TTL_MINUTES,
        "resend_after_seconds": otp.RESEND_AFTER_SECONDS,
    }
    user = db.scalar(select(User).where(func.lower(User.email) == email))
    if user and user.is_active and is_video_admin(user):
        issued = _issue_challenge(user, db, purpose="reset")
        reply["challenge_id"] = issued["challenge_id"]
    return reply


@router.post("/password/reset")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    challenge = _get_challenge(data.challenge_id, db, purpose="reset")
    if not otp.codes_match(challenge.code_hash, challenge.id, data.code):
        challenge.attempts += 1
        if challenge.attempts >= otp.MAX_ATTEMPTS:
            db.delete(challenge)
            db.commit()
            raise HTTPException(status_code=429, detail="Too many incorrect codes. Please request a new one.")
        db.commit()
        left = otp.MAX_ATTEMPTS - challenge.attempts
        raise HTTPException(status_code=401, detail=f"That code isn't right. {left} {'try' if left == 1 else 'tries'} left.")

    user = db.get(User, challenge.user_id)
    db.delete(challenge)
    if not user or not user.is_active:
        db.commit()
        raise HTTPException(status_code=403, detail="User account is inactive")
    user.password_hash = hash_password(data.new_password)
    db.commit()
    return {"message": "Your password has been updated. Please sign in with your new password."}


def _get_challenge(challenge_id: str, db: Session, purpose: str = "login") -> LoginChallenge:
    # Reset codes and sign-in codes are not interchangeable.
    if challenge_id.startswith(RESET_PREFIX) != (purpose == "reset"):
        raise HTTPException(status_code=400, detail="This code has expired. Please start again.")
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
def resend_login_code(data: OtpResendRequest, db: Session = Depends(get_db)):
    # Works for both sign-in and password-reset codes.
    purpose = "reset" if data.challenge_id.startswith(RESET_PREFIX) else "login"
    challenge = _get_challenge(data.challenge_id, db, purpose)
    sent_at = challenge.sent_at if challenge.sent_at.tzinfo else challenge.sent_at.replace(tzinfo=timezone.utc)
    wait = otp.RESEND_AFTER_SECONDS - (datetime.now(timezone.utc) - sent_at).total_seconds()
    if wait > 0:
        raise HTTPException(status_code=429, detail=f"Please wait {int(wait) + 1} seconds before requesting a new code.")
    user = db.get(User, challenge.user_id)
    if not user:
        raise HTTPException(status_code=400, detail="Please sign in again.")
    return _issue_challenge(user, db, purpose)


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
