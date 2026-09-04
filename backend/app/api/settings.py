from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.core.models import AppSettings
from app.schemas.settings import (
    AppSettingsCreate,
    AppSettingsResponse,
    AppSettingsUpdate,
)
import uuid
from datetime import datetime

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=AppSettingsResponse)
async def get_settings(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(AppSettings))
    settings = result.scalar_one_or_none()
    if not settings:
        settings = AppSettings(
            id=str(uuid.uuid4()),
            agnes_api_key="",
        )
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    return AppSettingsResponse.model_validate(settings)


@router.put("", response_model=AppSettingsResponse)
async def update_settings(
    data: AppSettingsUpdate, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(AppSettings))
    settings = result.scalar_one_or_none()
    if not settings:
        settings = AppSettings(
            id=str(uuid.uuid4()),
            agnes_api_key=data.agnes_api_key,
        )
        db.add(settings)
    else:
        settings.agnes_api_key = data.agnes_api_key
    await db.commit()
    await db.refresh(settings)
    return AppSettingsResponse.model_validate(settings)
