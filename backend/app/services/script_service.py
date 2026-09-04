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


def _get_client():
    from openai import OpenAI

    return OpenAI(
        api_key=settings.AGNES_API_KEY,
        base_url=settings.AGNES_BASE_URL,
    )


async def generate_script(story_input: str, chapters: int = 8) -> list[dict]:
    if not settings.AGNES_API_KEY:
        return [
            {
                "sceneIndex": i,
                "title": f"场景 {i + 1}",
                "description": f"这是场景 {i + 1} 的描述。",
                "mood": "戏剧性",
                "characters": ["角色A"],
                "action": "动作描述",
                "dialogue": "对话内容",
            }
            for i in range(chapters)
        ]
    try:
        client = _get_client()
        response = client.chat.completions.create(
            model="agnes-2.5-flash",
            messages=[
                {
                    "role": "system",
                    "content": "你是一个漫画剧脚本生成器。输出严格的JSON数组场景对象。每个场景必须包含：sceneIndex、title、description、mood、characters、action、dialogue。只输出JSON数组，不要包含markdown代码块。",
                },
                {
                    "role": "user",
                    "content": f"从以下故事生成 {chapters} 个场景：\n\n{story_input}\n\n输出ONLY有效的JSON数组。",
                },
            ],
            temperature=0.8,
            max_tokens=4096,
        )
        content = response.choices[0].message.content
        scenes = _extract_json(content)
        if scenes:
            return scenes
    except Exception:
        pass
    return [
        {
            "sceneIndex": i,
            "title": f"场景 {i + 1}",
            "description": "",
            "mood": "",
            "characters": [],
            "action": "",
            "dialogue": "",
        }
        for i in range(chapters)
    ]
