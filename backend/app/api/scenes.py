from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.core.models import Scene, Shot
from app.schemas.scene import SceneCreate, SceneUpdate, SceneResponse, SceneWithShots
from app.schemas.shot import ShotResponse
import uuid
from datetime import datetime

router = APIRouter(prefix="/scenes", tags=["scenes"])


@router.get("/project/{project_id}", response_model=List[SceneResponse])
async def list_scenes(project_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(
        select(Scene)
        .where(Scene.project_id == project_id)
        .order_by(Scene.chapter_index, Scene.scene_index)
    )
    scenes = result.scalars().all()
    return [SceneResponse.model_validate(s) for s in scenes]


@router.post("/project/{project_id}", response_model=SceneResponse)
async def create_scene(
    project_id: str, data: SceneCreate, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Scene).where(Scene.project_id == project_id))
    scenes = result.scalars().all()
    scene = Scene(
        id=str(uuid.uuid4()),
        project_id=project_id,
        chapter_index=data.chapter_index,
        scene_index=len(scenes),
        title=data.title,
        description=data.description,
        mood=data.mood,
        characters=data.characters,
        script_content=data.script_content,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(scene)
    await db.commit()
    await db.refresh(scene)
    return SceneResponse.model_validate(scene)


@router.get("/{scene_id}", response_model=SceneWithShots)
async def get_scene(scene_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Scene).where(Scene.id == scene_id))
    scene = result.scalar_one_or_none()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    shots_result = await db.execute(
        select(Shot).where(Shot.scene_id == scene_id).order_by(Shot.shot_index)
    )
    shots = shots_result.scalars().all()
    return SceneWithShots.model_validate(
        scene, update={"shots": [ShotResponse.model_validate(s) for s in shots]}
    )


@router.put("/{scene_id}", response_model=SceneResponse)
async def update_scene(
    scene_id: str, data: SceneUpdate, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Scene).where(Scene.id == scene_id))
    scene = result.scalar_one_or_none()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(scene, key, value)
    await db.commit()
    await db.refresh(scene)
    return SceneResponse.model_validate(scene)


@router.delete("/{scene_id}")
async def delete_scene(scene_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Scene).where(Scene.id == scene_id))
    scene = result.scalar_one_or_none()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    await db.delete(scene)
    await db.commit()
    return {"success": True}
