from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.core.models import Character
from app.schemas.character import CharacterCreate, CharacterUpdate, CharacterResponse
import uuid
from datetime import datetime

router = APIRouter(prefix="/characters", tags=["characters"])


@router.get("/project/{project_id}", response_model=List[CharacterResponse])
async def list_characters(project_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(
        select(Character).where(Character.project_id == project_id)
    )
    characters = result.scalars().all()
    return [CharacterResponse.model_validate(c) for c in characters]


@router.post("/project/{project_id}", response_model=CharacterResponse)
async def create_character(
    project_id: str, data: CharacterCreate, db: AsyncSession = Depends(get_async_db)
):
    character = Character(
        id=str(uuid.uuid4()),
        project_id=project_id,
        name=data.name,
        description=data.description,
        reference_image=data.reference_image,
        style=data.style,
        personality=data.personality,
    )
    db.add(character)
    await db.commit()
    await db.refresh(character)
    return CharacterResponse.model_validate(character)


@router.get("/{char_id}", response_model=CharacterResponse)
async def get_character(char_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Character).where(Character.id == char_id))
    character = result.scalar_one_or_none()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return CharacterResponse.model_validate(character)


@router.put("/{char_id}", response_model=CharacterResponse)
async def update_character(
    char_id: str, data: CharacterUpdate, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Character).where(Character.id == char_id))
    character = result.scalar_one_or_none()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(character, key, value)
    await db.commit()
    await db.refresh(character)
    return CharacterResponse.model_validate(character)


@router.delete("/{char_id}")
async def delete_character(char_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Character).where(Character.id == char_id))
    character = result.scalar_one_or_none()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    await db.delete(character)
    await db.commit()
    return {"success": True}
