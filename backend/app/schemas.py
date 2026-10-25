from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl


class LoginRequest(BaseModel):
    """Passwordless owner sign-in: the owner's email or mobile number receives the OTP."""
    otp_channel: Literal["email", "phone"] = "email"
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=20)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime


class AuthResponse(BaseModel):
    message: str
    user: UserResponse
    is_video_admin: bool = False


class VideoWrite(BaseModel):
    id: str = Field(min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=120)
    url: HttpUrl
    description: str = Field(default="", max_length=5000)
    project_slug: Optional[str] = Field(default=None, max_length=150)


class VideoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    url: str
    description: str
    project_slug: Optional[str]
    created_at: datetime
