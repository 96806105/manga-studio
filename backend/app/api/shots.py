from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.core.models import Shot, Scene
from app.schemas.shot import ShotCreate, ShotUpdate, ShotResponse
import uuid
from datetime import datetime

router = APIRouter(prefix="/shots", tags=["shots"])


@router.get("/scene/{scene_id}", response_model=List[ShotResponse])
async def list_shots(scene_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(
        select(Shot).where(Shot.scene_id == scene_id).order_by(Shot.shot_index)
    )
    shots = result.scalars().all()
    return [ShotResponse.model_validate(s) for s in shots]


@router.post("/scene/{scene_id}", response_model=ShotResponse)
async def create_shot(
    scene_id: str, data: ShotCreate, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Shot).where(Shot.scene_id == scene_id))
    shots = result.scalars().all()
    shot = Shot(
        id=str(uuid.uuid4()),
        scene_id=scene_id,
        shot_index=len(shots),
        description=data.description,
        type=data.type,
        camera_config=data.camera_config,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(shot)
    await db.commit()
    await db.refresh(shot)
    return ShotResponse.model_validate(shot)


@router.put("/{shot_id}", response_model=ShotResponse)
async def update_shot(
    shot_id: str, data: ShotUpdate, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Shot).where(Shot.id == shot_id))
    shot = result.scalar_one_or_none()
    if not shot:
        raise HTTPException(status_code=404, detail="Shot not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(shot, key, value)
    await db.commit()
    await db.refresh(shot)
    return ShotResponse.model_validate(shot)


@router.get("/{shot_id}", response_model=ShotResponse)
async def get_shot(shot_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Shot).where(Shot.id == shot_id))
    shot = result.scalar_one_or_none()
    if not shot:
        raise HTTPException(status_code=404, detail="Shot not found")
    return ShotResponse.model_validate(shot)


@router.delete("/{shot_id}")
async def delete_shot(shot_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Shot).where(Shot.id == shot_id))
    shot = result.scalar_one_or_none()
    if not shot:
        raise HTTPException(status_code=404, detail="Shot not found")
    await db.delete(shot)
    await db.commit()
    return {"success": True}
