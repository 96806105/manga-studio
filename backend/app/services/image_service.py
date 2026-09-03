import httpx
import base64
from io import BytesIO
from app.core.config import settings


async def generate_image(prompt: str, negative_prompt: str = "") -> str:
    if not settings.POLLINATIONS_API_KEY:
        api_key = (
            settings.POLLINATIONS_API_KEY
            if hasattr(settings, "POLLINATIONS_API_KEY")
            else ""
        )
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            "https://image.pollinations.ai/prompt",
            params={
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "width": "1024",
                "height": "1024",
                "model": "flux",
                "seed": "0",
                "transparent": "false",
            },
            headers={"Authorization": f"Bearer {settings.POLLINATIONS_API_KEY}"}
            if settings.POLLINATIONS_API_KEY
            else {},
        )
        response.raise_for_status()
        image_data = response.content
        return base64.b64encode(image_data).decode("utf-8")
