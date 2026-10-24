import hmac
import os

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from jose import JWTError
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import config  # noqa: F401
from ..database import get_db
from ..dependencies import ACCESS_COOKIE, REFRESH_COOKIE, get_current_user
from ..models import OwnerSetupState, User
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


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    email = data.email.lower().strip()
    user = db.scalar(select(User).where(func.lower(User.email) == email))

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User account is inactive")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    set_auth_cookies(response, access_token, refresh_token)

    return AuthResponse(
        message="Login successful",
        user=user,
        is_video_admin=is_video_admin(user),
    )


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
