from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    cover_image: Optional[str] = None
    export_path: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime
    cover_image: Optional[str] = None
    export_path: Optional[str] = None

    class Config:
        from_attributes = True


class ProjectStats(BaseModel):
    scenes: int = 0
    shots: int = 0
    videos: int = 0


class ProjectWithStats(ProjectResponse):
    stats: ProjectStats
