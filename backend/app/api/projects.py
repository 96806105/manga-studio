from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.core.models import Project, Scene, Shot, Character, GeneratedVideo
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectWithStats,
    ProjectStats,
)
import uuid
from datetime import datetime

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[ProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Project).order_by(Project.updated_at.desc()))
    projects = result.scalars().all()
    return [ProjectResponse.model_validate(p) for p in projects]


@router.post("", response_model=ProjectResponse)
async def create_project(data: ProjectCreate, db: AsyncSession = Depends(get_async_db)):
    project = Project(
        id=str(uuid.uuid4()),
        name=data.name,
        description=data.description,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)


@router.get("/{project_id}", response_model=ProjectWithStats)
async def get_project(project_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    scenes_result = await db.execute(
        select(Scene).where(Scene.project_id == project_id)
    )
    scenes = scenes_result.scalars().all()
    shots_count = 0
    videos_count = 0
    for scene in scenes:
        for shot in scene.shots:
            shots_count += 1
            for v in shot.generated_videos:
                if v.status == "completed":
                    videos_count += 1
    stats = ProjectStats(scenes=len(scenes), shots=shots_count, videos=videos_count)
    return ProjectWithStats.model_validate(project, update={"stats": stats})


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str, data: ProjectUpdate, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    project.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)


@router.delete("/{project_id}")
async def delete_project(project_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()
    return {"success": True}


@router.get("/{project_id}/stats", response_model=ProjectStats)
async def get_project_stats(project_id: str, db: AsyncSession = Depends(get_async_db)):
    scenes_result = await db.execute(
        select(Scene).where(Scene.project_id == project_id)
    )
    scenes = scenes_result.scalars().all()
    shots_count = 0
    videos_count = 0
    for scene in scenes:
        for shot in scene.shots:
            shots_count += 1
            for v in shot.generated_videos:
                if v.status == "completed":
                    videos_count += 1
    return ProjectStats(scenes=len(scenes), shots=shots_count, videos=videos_count)
