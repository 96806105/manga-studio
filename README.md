# Manga Studio - AI Manga/Drama Video Creation Workstation

Cloud-deployed AI workstation for creating manga and short drama videos from novels or story outlines.

## Architecture

- **Backend**: FastAPI (Python) with diffusers for video generation
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Database**: SQLite (aiosqlite)
- **Video Models**: Wan2.1 1.3B, LTXVideo 1.3B (cloud GPU)
- **AI Services**: DeepSeek API (script), Pollinations.ai (images)
- **Video Assembly**: FFmpeg

## Deployment

### RunPod (Recommended)

```bash
# 1. Create RunPod instance with RTX 4090
# 2. SSH into instance
git clone <repo>
cd manga-studio

# 3. Set API keys
cp .env.example .env
# Edit .env with your API keys

# 4. Build and start
docker-compose up -d --build
```

Access at `http://your-server-ip`

## Features

- 📝 Script Generation from novel text
- 🎨 Character reference image generation
- 🎬 Keyframe-based storyboard editing
- 🎥 AI video generation (Wan2.1/LTXVideo)
- 🎞️ Video assembly and export

## Cost

- RunPod RTX 4090: $0.34/hr
- Full project (~180 clips): ~$5 GPU
- API costs: ~$0 (free tiers)