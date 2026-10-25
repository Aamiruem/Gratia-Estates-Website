import os
import sys
from getpass import getpass

from sqlalchemy import func, select

from . import config  # noqa: F401
from .database import SessionLocal
from .models import User
from .security import hash_password


def main() -> int:
    owner_email = os.getenv("VIDEO_ADMIN_EMAIL", "").strip().lower()
    if not owner_email:
        print("VIDEO_ADMIN_EMAIL is not configured.", file=sys.stderr)
        return 1

    password = getpass("New owner password (8-128 characters): ")
    if not 8 <= len(password) <= 128:
        print("Password must be between 8 and 128 characters.", file=sys.stderr)
        return 1

    confirmation = getpass("Confirm new owner password: ")
    if password != confirmation:
        print("Passwords do not match; no changes were made.", file=sys.stderr)
        return 1

    with SessionLocal() as db:
        user = db.scalar(
            select(User)
            .where(User.role == "video_admin")
            .order_by(User.id)
        )
        if user is None:
            user = db.scalar(select(User).where(func.lower(User.email) == owner_email))
        if user is None:
            print(
                "The configured owner account was not found; no changes were made.",
                file=sys.stderr,
            )
            return 1

        user.password_hash = hash_password(password)
        db.commit()

    print("Owner password updated. Sign in with the new password.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
