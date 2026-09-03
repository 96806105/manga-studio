from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class SceneBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    mood: str = Field(default="")
    characters: List[str] = Field(default_factory=list)


class SceneCreate(SceneBase):
    chapter_index: int = Field(default=0)
    script_content: str = Field(default="")


class SceneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    mood: Optional[str] = None
    characters: Optional[List[str]] = None
    script_content: Optional[str] = None
    status: Optional[str] = None


class SceneResponse(SceneBase):
    id: str
    project_id: str
    chapter_index: int
    scene_index: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SceneWithShots(SceneResponse):
    shots: List[dict] = []
