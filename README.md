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
#    - Use RunPod console: https://runpod.io/console
#    - Select GPU: RTX 4090 (or RTX A6000 for more VRAM)
#    - Choose container template: Docker
#    - Set disk: 50GB+

# 2. SSH into instance
ssh root@<your-server-ip>

# 3. Clone repo
git clone https://github.com/96806105/manga-studio.git
cd manga-studio

# 4. Set API keys
cp .env.example .env
# Edit .env with your DeepSeek and Pollinations API keys

# 5. Build and start
docker-compose up -d --build
```

Access at `http://your-server-ip`

### Quick Start (Local)

```bash
# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## Features

- 📝 Script Generation from novel text (DeepSeek API)
- 🎨 Character reference image generation (Pollinations.ai)
- 🎬 Keyframe-based storyboard editing
- 🎥 AI video generation (Wan2.1/LTXVideo on GPU)
- 🎞️ Video assembly and export (FFmpeg)

## Cost

- RunPod RTX 4090: $0.34/hr
- Full project (~180 clips): ~$5 GPU
- API costs: ~$0 (DeepSeek free tier: 5M tokens/month, Pollinations.ai: free)