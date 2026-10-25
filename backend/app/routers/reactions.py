import re

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import VideoReaction

router = APIRouter(prefix="/reactions", tags=["Video reactions"])

YOUTUBE_ID = re.compile(r"^[A-Za-z0-9_-]{11}$")


class ReactionChange(BaseModel):
    # Each visitor changes a count by at most one step at a time
    # (e.g. like +1, or switching from dislike to like: like +1, dislike -1).
    like: int = Field(default=0, ge=-1, le=1)
    dislike: int = Field(default=0, ge=-1, le=1)


def _check_id(youtube_id: str) -> str:
    if not YOUTUBE_ID.match(youtube_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid video ID")
    return youtube_id


@router.get("")
def get_reactions(ids: str = Query(default="", max_length=1200), db: Session = Depends(get_db)):
    wanted = [i for i in ids.split(",") if YOUTUBE_ID.match(i)][:100]
    if not wanted:
        return {}
    rows = db.scalars(select(VideoReaction).where(VideoReaction.youtube_id.in_(wanted))).all()
    found = {row.youtube_id: {"likes": row.likes, "dislikes": row.dislikes} for row in rows}
    return {i: found.get(i, {"likes": 0, "dislikes": 0}) for i in wanted}


@router.post("/{youtube_id}")
def change_reaction(youtube_id: str, change: ReactionChange, db: Session = Depends(get_db)):
    _check_id(youtube_id)
    row = db.get(VideoReaction, youtube_id)
    if row is None:
        row = VideoReaction(youtube_id=youtube_id, likes=0, dislikes=0)
        db.add(row)
    row.likes = max(0, row.likes + change.like)
    row.dislikes = max(0, row.dislikes + change.dislike)
    db.commit()
    return {"likes": row.likes, "dislikes": row.dislikes}
