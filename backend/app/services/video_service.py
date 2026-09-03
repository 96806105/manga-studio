import asyncio
import os
import subprocess
from pathlib import Path
from app.core.config import settings


async def generate_video_wan21(
    prompt: str,
    output_path: str,
    resolution: str = "480p",
    duration: int = 5,
    model_size: str = "1.3B",
) -> dict:
    models_dir = Path(settings.MODELS_DIR)
    model_dir = models_dir / f"Wan2.1-T2V-{model_size}"
    if not model_dir.exists():
        return {
            "error": f"Model not found at {model_dir}. Please download Wan2.1 model."
        }
    size_map = {"480p": "832*480", "720p": "1280*720"}
    size = size_map.get(resolution, "832*480")
    cmd = [
        "python",
        str(models_dir / "Wan2.1-T2V-1.3B/generate.py"),
        "--task",
        f"t2v-{model_size}",
        "--size",
        size,
        "--ckpt_dir",
        str(model_dir),
        "--prompt",
        prompt,
        "--save_file",
        output_path,
        "--num_frames",
        str(duration * 2),
    ]
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await asyncio.wait_for(
            proc.communicate(), timeout=duration * 60 * 3
        )
        if proc.returncode != 0:
            return {"error": stderr.decode()[:500]}
        return {"output_path": output_path, "prompt": prompt, "resolution": resolution}
    except asyncio.TimeoutExpired:
        proc.kill()
        return {"error": "Video generation timed out"}
    except FileNotFoundError:
        return {
            "error": "Wan2.1 generate.py not found. Please ensure model files are downloaded."
        }


async def generate_video_ltx(
    prompt: str, output_path: str, resolution: str = "720p"
) -> dict:
    models_dir = Path(settings.MODELS_DIR)
    model_dir = models_dir / "LTX-Video-1.3B"
    if not model_dir.exists():
        return {"error": f"LTXVideo model not found at {model_dir}"}
    try:
        from diffusers import LTXVideoPipeline
        import torch

        pipe = LTXVideoPipeline.from_pretrained(
            model_dir, torch_dtype=torch.float16
        ).to("cuda")
        video = pipe(prompt, num_frames=duration * 2, width=1280, height=720).frames[0]
        video.save(output_path)
        return {"output_path": output_path, "prompt": prompt, "resolution": resolution}
    except ImportError:
        return {"error": "diffusers not installed. Run: pip install diffusers"}
    except Exception as e:
        return {"error": str(e)[:500]}
