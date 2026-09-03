from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ShotBase(BaseModel):
    description: str = Field(default="")
    type: str = Field(default="medium")
    camera_config: dict = Field(
        default={"angle": "wide", "movement": "static", "duration": 5}
    )


class ShotCreate(ShotBase):
    pass


class ShotUpdate(BaseModel):
    description: Optional[str] = None
    type: Optional[str] = None
    start_frame: Optional[str] = None
    end_frame: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    camera_config: Optional[dict] = None
    status: Optional[str] = None


class ShotResponse(ShotBase):
    id: str
    scene_id: str
    shot_index: int
    start_frame: Optional[str] = None
    end_frame: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str
    generation_progress: float = 0.0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
