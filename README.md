# Manga Studio - AI 漫画/短剧视频创作工作站

云端部署的 AI 漫画和短剧视频创作工作站。

## 架构

- **后端**: FastAPI (Python) + Agnes AI API
- **前端**: React + Vite + TypeScript + Tailwind CSS（中文界面）
- **数据库**: SQLite (aiosqlite)
- **视频生成**: Agnes Video 2.5 Flash（文生视频、首尾帧、图片参考）
- **AI 服务**: Agnes AI API（文本生成 GLM-2.5-Flash、图片生成 Agnes-Image-2.1-Flash、视频生成 Agnes-Video-2.5-Flash）
- **视频组装**: FFmpeg

## 部署

### RunPod（推荐）

```bash
# 1. 创建 RunPod 实例（RTX 4090）
# 2. SSH 连接并克隆仓库
git clone https://github.com/96806105/manga-studio.git
cd manga-studio

# 3. 设置 API 密钥
cp .env.example .env
# 编辑 .env 填入 Agnes AI API Key：https://agnes-ai.com

# 4. 构建并启动
docker-compose up -d --build
```

访问 `http://your-server-ip`

### 快速启动（本地）

```bash
# 后端
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# 前端
cd frontend
npm install
npm run dev
```

## 功能

- 📝 脚本生成（Agnes AI 文本模型）
- 🎨 图片生成（Agnes Image 2.1 Flash）
- 🎬 关键帧故事板编辑
- 🎥 视频生成（Agnes Video 2.5 Flash）
- 🎞️ 视频组装和导出（FFmpeg）
- ⚙️ Settings 页面配置 API 密钥

## API

所有 API 端点位于 `/api/v1/` 前缀，完整文档见 `/docs`。

| 端点 | 说明 |
|------|------|
| `/api/v1/projects` | 项目 CRUD |
| `/api/v1/scenes/project/{pid}` | 场景列表/创建 |
| `/api/v1/shots/scene/{sid}` | 镜头列表/创建 |
| `/api/v1/characters/project/{pid}` | 角色 CRUD |
| `/api/v1/generation/script` | 脚本生成 |
| `/api/v1/generation/shot/{id}/image` | 图片生成 |
| `/api/v1/generation/shot/{id}/video` | 视频生成 |
| `/api/v1/settings` | Settings CRUD |
| `/api/v1/export` | 项目导出 |

## 成本

- Agnes AI API：当前限时免费
- RunPod RTX 4090：$0.34/小时（如需本地推理）

## 获取 Agnes API Key

访问 [https://agnes-ai.com](https://agnes-ai.com) 注册账号并获取 API Key。