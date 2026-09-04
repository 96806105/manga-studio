import base64
from app.core.config import settings


async def generate_image(prompt: str, negative_prompt: str = "") -> str:
    headers = {"Authorization": f"Bearer {settings.AGNES_API_KEY}"}
    payload = {
        "model": "agnes-image-2.1-flash",
        "prompt": prompt,
        "size": "1024x1024",
    }
    import httpx

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            f"{settings.AGNES_BASE_URL}/images/generations",
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        image_url = data["data"][0]["url"]
    async with httpx.AsyncClient(timeout=120) as img_client:
        img_response = await img_client.get(image_url)
        img_response.raise_for_status()
        return base64.b64encode(img_response.content).decode("utf-8")
