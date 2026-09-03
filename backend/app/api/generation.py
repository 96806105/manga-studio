from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.core.models import Shot, GeneratedVideo, Scene
from app.services.script_service import generate_script as _gen_script
from app.services.image_service import generate_image as _gen_image
from app.services.video_service import generate_video_wan21, generate_video_ltx
from app.services.export_service import assemble_video
import os, uuid, base64, tempfile
from datetime import datetime

router = APIRouter(prefix="/generation", tags=["generation"])


@router.post("/script")
async def generate_script_endpoint(
    data: dict, db: AsyncSession = Depends(get_async_db)
):
    story_input = data.get("story_input", "")
    chapters = data.get("chapters", 8)
    project_id = data.get("project_id", "")
    scenes = await _gen_script(story_input, chapters)
    for scene_data in scenes:
        result = await db.execute(select(Scene).where(Scene.project_id == project_id))
        scenes_count = len(result.scalars().all())
        scene = Scene(
            id=str(uuid.uuid4()),
            project_id=project_id,
            chapter_index=scene_data.get("sceneIndex", 0),
            scene_index=scenes_count,
            title=scene_data.get("title", "Untitled"),
            description=scene_data.get("description", ""),
            mood=scene_data.get("mood", ""),
            characters=scene_data.get("characters", []),
            script_content=str(scene_data),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(scene)
    await db.commit()
    return {
        "success": True,
        "scenes": [
            {"sceneIndex": s.get("sceneIndex", 0), "title": s.get("title", "")}
            for s in scenes
        ],
    }


@router.post("/shot/{shot_id}/image")
async def generate_shot_image(shot_id: str, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Shot).where(Shot.id == shot_id))
    shot = result.scalar_one_or_none()
    if not shot:
        raise HTTPException(status_code=404, detail="Shot not found")
    await db.execute(
        update(Shot)
        .where(Shot.id == shot_id)
        .values(status="generating", generation_progress=0)
    )
    await db.commit()
    try:
        image_b64 = await _gen_image(shot.description or "a beautiful manga scene")
        image_data = base64.b64decode(image_b64)
        tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False, dir="./exports")
        tmp.write(image_data)
        tmp.close()
        image_url = f"/exports/{os.path.basename(tmp.name)}"
        await db.execute(
            update(Shot)
            .where(Shot.id == shot_id)
            .values(image_url=image_url, status="generated")
        )
        await db.commit()
        return {"success": True, "imageUrl": image_url}
    except Exception as e:
        await db.execute(update(Shot).where(Shot.id == shot_id).values(status="error"))
        await db.commit()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/shot/{shot_id}/video")
async def generate_shot_video(
    shot_id: str, data: dict = None, db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Shot).where(Shot.id == shot_id))
    shot = result.scalar_one_or_none()
    if not shot:
        raise HTTPException(status_code=404, detail="Shot not found")
    resolution = (data or {}).get("resolution", "480p")
    await db.execute(
        update(Shot)
        .where(Shot.id == shot_id)
        .values(status="generating", generation_progress=0)
    )
    await db.commit()
    video_id = str(uuid.uuid4())
    video_path = f"./exports/{video_id}.mp4"
    os.makedirs("./exports", exist_ok=True)
    video = await generate_video_wan21(
        prompt=shot.description or "a cinematic manga scene",
        output_path=video_path,
        resolution=resolution,
        duration=5,
    )
    if "error" in video:
        await db.execute(update(Shot).where(Shot.id == shot_id).values(status="error"))
        raise HTTPException(status_code=500, detail=video["error"])
    gen_video = GeneratedVideo(
        id=video_id,
        shot_id=shot_id,
        video_url=f"/exports/{video_id}.mp4",
        resolution=resolution,
        model="Wan2.1-1.3B",
        status="completed",
        created_at=datetime.utcnow(),
    )
    db.add(gen_video)
    await db.execute(
        update(Shot)
        .where(Shot.id == shot_id)
        .values(video_url=f"/exports/{video_id}.mp4", status="generated")
    )
    await db.commit()
    return {
        "success": True,
        "videoUrl": f"/exports/{video_id}.mp4",
        "resolution": resolution,
    }
