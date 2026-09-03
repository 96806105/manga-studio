from sqlalchemy import (
    Column,
    String,
    Integer,
    Text,
    DateTime,
    ForeignKey,
    JSON,
    Float,
    Boolean,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, default="")
    status = Column(String, default="draft", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    cover_image = Column(String, nullable=True)
    export_path = Column(String, nullable=True)
    settings = Column(JSON, default={})
    scenes = relationship(
        "Scene", back_populates="project", cascade="all, delete-orphan"
    )
    characters = relationship(
        "Character", back_populates="project", cascade="all, delete-orphan"
    )


class Scene(Base):
    __tablename__ = "scenes"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(
        String,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    chapter_index = Column(Integer, default=0)
    scene_index = Column(Integer, default=0)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    mood = Column(String, default="")
    characters = Column(JSON, default=[])
    script_content = Column(Text, default="")
    status = Column(String, default="pending")
    project = relationship("Project", back_populates="scenes")
    shots = relationship("Shot", back_populates="scene", cascade="all, delete-orphan")


class Shot(Base):
    __tablename__ = "shots"
    id = Column(String, primary_key=True, index=True)
    scene_id = Column(
        String, ForeignKey("scenes.id", ondelete="CASCADE"), nullable=False, index=True
    )
    shot_index = Column(Integer, default=0)
    type = Column(String, default="medium")
    start_frame = Column(String, nullable=True)
    end_frame = Column(String, nullable=True)
    description = Column(Text, default="")
    image_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    camera_config = Column(
        JSON, default={"angle": "wide", "movement": "static", "duration": 5}
    )
    status = Column(String, default="pending")
    generation_progress = Column(Float, default=0.0)
    scene = relationship("Scene", back_populates="shots")
    generated_videos = relationship(
        "GeneratedVideo", back_populates="shot", cascade="all, delete-orphan"
    )


class Character(Base):
    __tablename__ = "characters"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(
        String,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String, nullable=False)
    description = Column(Text, default="")
    reference_image = Column(String, nullable=True)
    style = Column(String, default="anime")
    personality = Column(Text, default="")
    project = relationship("Project", back_populates="characters")


class GeneratedVideo(Base):
    __tablename__ = "generated_videos"
    id = Column(String, primary_key=True, index=True)
    shot_id = Column(
        String, ForeignKey("shots.id", ondelete="CASCADE"), nullable=False, index=True
    )
    video_url = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    duration = Column(Float, default=0)
    resolution = Column(String, default="480p")
    model = Column(String, default="")
    status = Column(String, default="pending")
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    shot = relationship("Shot", back_populates="generated_videos")


class Task(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(
        String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    task_type = Column(String, nullable=False)
    status = Column(String, default="pending")
    progress = Column(Float, default=0.0)
    result = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
