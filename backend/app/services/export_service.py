import subprocess
import os
from pathlib import Path


async def assemble_video(
    video_urls: list[str],
    output_path: str,
    resolution: str = "480p",
    framerate: int = 24,
) -> dict:
    if not video_urls:
        return {"error": "No videos to assemble"}
    work_dir = Path(output_path).parent
    temp_files = []
    for i, url in enumerate(video_urls):
        temp_path = str(work_dir / f"temp_clip_{i}.mp4")
        if os.path.exists(url):
            temp_files.append(temp_path)
        else:
            temp_files.append(url)
    if len(temp_files) == 1:
        os.rename(temp_files[0], output_path)
        return {"output_path": output_path}
    file_list_path = str(work_dir / "file_list.txt")
    with open(file_list_path, "w") as f:
        for tf in temp_files:
            f.write(f"file '{tf}'\n")
    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        file_list_path,
        "-c",
        "copy",
        "-r",
        str(framerate),
        str(output_path),
    ]
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=300)
        if proc.returncode != 0:
            return {"error": stderr.decode()[:500]}
        return {"output_path": output_path}
    except asyncio.TimeoutExpired:
        proc.kill()
        return {"error": "Export timed out"}
    except Exception as e:
        return {"error": str(e)[:500]}
