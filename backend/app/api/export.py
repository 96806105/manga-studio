from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.core.models import Project, Scene, Shot, GeneratedVideo
from app.services.export_service import assemble_video
import os, uuid

router = APIRouter(prefix="/export", tags=["export"])


@router.post("", response_model=dict)
async def export_project(data: dict, db: AsyncSession = Depends(get_async_db)):
    project_id = data.get("project_id", "")
    settings_data = data.get("settings", {})
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    scenes_result = await db.execute(
        select(Scene).where(Scene.project_id == project_id)
    )
    scenes = scenes_result.scalars().all()
    video_urls = []
    for scene in scenes:
        for shot in scene.shots:
            if shot.video_url:
                video_urls.append(shot.video_url)
    if not video_urls:
        return {"success": False, "error": "No videos to export"}
    os.makedirs("./exports", exist_ok=True)
    export_path = f"./exports/{project_id}_export.mp4"
    result_export = await assemble_video(
        video_urls, export_path, framerate=settings_data.get("framerate", 24)
    )
    if "error" in result_export:
        raise HTTPException(status_code=500, detail=result_export["error"])
    await db.execute(
        update(Project)
        .where(Project.id == project_id)
        .values(status="exported", export_path=export_path)
    )
    await db.commit()
    return {"success": True, "exportPath": f"/exports/{project_id}_export.mp4"}
