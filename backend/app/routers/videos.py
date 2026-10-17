import os

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import config  # noqa: F401
from ..database import get_db
from ..dependencies import get_current_user
from ..models import User, Video
from ..schemas import VideoResponse, VideoWrite

router = APIRouter(prefix="/videos", tags=["Project videos"])


def require_video_admin(current_user: User = Depends(get_current_user)) -> User:
    owner_email = os.getenv("VIDEO_ADMIN_EMAIL", "").strip().lower()
    if not owner_email:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Video owner access is not configured on the backend",
        )
    if current_user.email.lower() != owner_email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is not allowed to manage project videos",
        )
    return current_user


@router.get("", response_model=list[VideoResponse])
def list_videos(db: Session = Depends(get_db)):
    return db.scalars(
        select(Video).order_by(Video.created_at.desc(), Video.id)
    ).all()


def upsert_video(payload: VideoWrite, db: Session) -> Video:
    video = db.get(Video, payload.id)
    if video is None:
        video = Video(id=payload.id)
        db.add(video)

    video.title = payload.title.strip()
    video.url = str(payload.url)
    video.description = payload.description
    video.project_slug = payload.project_slug
    return video


@router.put("", response_model=list[VideoResponse])
def upsert_videos(
    payloads: list[VideoWrite],
    db: Session = Depends(get_db),
    _admin: User = Depends(require_video_admin),
):
    if len(payloads) > 200:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="A maximum of 200 videos can be saved at once",
        )
    videos = [upsert_video(payload, db) for payload in payloads]
    db.commit()
    for video in videos:
        db.refresh(video)
    return videos


@router.put("/{video_id}", response_model=VideoResponse)
def save_video(
    video_id: str,
    payload: VideoWrite,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_video_admin),
):
    if video_id != payload.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Video ID in the URL must match the request body",
        )
    video = upsert_video(payload, db)
    db.commit()
    db.refresh(video)
    return video


@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video(
    video_id: str,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_video_admin),
):
    video = db.get(Video, video_id)
    if video is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found",
        )
    db.delete(video)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
