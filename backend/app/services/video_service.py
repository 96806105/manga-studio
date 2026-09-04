import asyncio
import os
from app.core.config import settings

AGNES_API = settings.AGNES_BASE_URL


async def _poll_video(video_id: str) -> dict:
    import httpx

    headers = {"Authorization": f"Bearer {settings.AGNES_API_KEY}"}
    for _ in range(60):
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.get(
                f"{AGNES_API}/agnesapi",
                params={"video_id": video_id, "model_name": "agnes-video-2.5-flash"},
                headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()
        status = data.get("status")
        if status == "completed":
            return data
        if status == "failed":
            raise Exception(data.get("detail", "Video generation failed"))
        await asyncio.sleep(2)
    raise Exception("Video generation timed out")


async def generate_video_agnes(
    prompt: str,
    output_path: str,
    resolution: str = "720P",
    duration: int = 5,
    mode: str = "text",
) -> dict:
    import httpx

    headers = {
        "Authorization": f"Bearer {settings.AGNES_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "agnes-video-2.5-flash",
        "prompt": prompt,
        "mode": mode,
        "seconds": str(duration),
        "size": "720P",
        "aspect_ratio": "16:9",
    }
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            f"{AGNES_API}/v1/videos",
            json=payload,
            headers=headers,
        )
        resp.raise_for_status()
        data = resp.json()
        video_id = data.get("video_id") or data.get("id")
    result = await _poll_video(video_id)
    video_url = result.get("video_url") or result.get("url")
    if video_url and video_url.startswith("http"):
        async with httpx.AsyncClient(timeout=120) as dl:
            vresp = await dl.get(video_url)
            vresp.raise_for_status()
            os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(vresp.content)
    else:
        video_url = output_path
    return {
        "output_path": output_path,
        "prompt": prompt,
        "resolution": resolution,
        "video_url": video_url,
    }


async def generate_video_wan21(
    prompt: str,
    output_path: str,
    resolution: str = "480p",
    duration: int = 5,
    model_size: str = "1.3B",
) -> dict:
    return await generate_video_agnes(prompt, output_path, resolution, duration)


async def generate_video_ltx(
    prompt: str, output_path: str, resolution: str = "720p"
) -> dict:
    return await generate_video_agnes(prompt, output_path, resolution)
