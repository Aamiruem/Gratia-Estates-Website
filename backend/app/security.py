import os
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from pwdlib import PasswordHash

from . import config  # noqa: F401

PASSWORD_HASHER = PasswordHash.recommended()

JWT_ALGORITHM = "HS256"
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_REFRESH_SECRET_KEY = os.getenv("JWT_REFRESH_SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

if not JWT_SECRET_KEY or not JWT_REFRESH_SECRET_KEY:
    raise RuntimeError("JWT secrets are missing from backend/.env")


def hash_password(password: str) -> str:
    return PASSWORD_HASHER.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return PASSWORD_HASHER.verify(password, password_hash)


def _create_token(user_id: int, secret: str, expires_delta: timedelta, token_type: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, secret, algorithm=JWT_ALGORITHM)


def create_access_token(user_id: int) -> str:
    return _create_token(
        user_id=user_id,
        secret=JWT_SECRET_KEY,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        token_type="access",
    )


def create_refresh_token(user_id: int) -> str:
    return _create_token(
        user_id=user_id,
        secret=JWT_REFRESH_SECRET_KEY,
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        token_type="refresh",
    )


def decode_token(token: str, token_type: str) -> int:
    secret = JWT_SECRET_KEY if token_type == "access" else JWT_REFRESH_SECRET_KEY
    payload = jwt.decode(token, secret, algorithms=[JWT_ALGORITHM])

    if payload.get("type") != token_type:
        raise JWTError("Invalid token type")

    subject = payload.get("sub")
    if not subject:
        raise JWTError("Token subject missing")

    return int(subject)
