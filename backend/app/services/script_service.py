import httpx
import json
from app.core.config import settings


def _extract_json(content: str) -> list[dict]:
    try:
        parsed = json.loads(content)
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict) and "content" in parsed:
            inner = parsed["content"]
            if (
                isinstance(inner, list)
                and len(inner) > 0
                and isinstance(inner[0], dict)
            ):
                return inner
            if isinstance(inner, str):
                try:
                    re_parsed = json.loads(inner)
                    if isinstance(re_parsed, list):
                        return re_parsed
                except json.JSONDecodeError:
                    pass
    except (json.JSONDecodeError, TypeError):
        pass
    return []


async def generate_script(story_input: str, chapters: int = 8) -> list[dict]:
    if not settings.DEEPSEEK_API_KEY:
        return [
            {
                "sceneIndex": i,
                "title": f"Scene {i + 1}",
                "description": f"This is scene {i + 1} description.",
                "mood": "dramatic",
                "characters": ["Character A"],
                "action": "Action description",
                "dialogue": "Dialogue here",
            }
            for i in range(chapters)
        ]
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}"},
            json={
                "model": "deepseek-chat",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a manga drama script writer. Output strict JSON array of scene objects. Each scene must have: sceneIndex, title, description, mood, characters, action, dialogue.",
                    },
                    {
                        "role": "user",
                        "content": f"Generate {chapters} scenes from this story:\n\n{story_input}\n\nOutput ONLY valid JSON array.",
                    },
                ],
                "temperature": 0.8,
                "max_tokens": 4096,
            },
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        scenes = _extract_json(content)
        if scenes:
            return scenes
        return [
            {
                "sceneIndex": i,
                "title": f"Scene {i + 1}",
                "description": content[:200],
                "mood": "",
                "characters": [],
                "action": "",
                "dialogue": "",
            }
            for i in range(chapters)
        ]
