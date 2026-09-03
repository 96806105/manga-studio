from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from pathlib import Path
from app.core.database import init_db, engine
from app.core.config import settings
from app.api import router as api_router

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def startup():
    init_db()


@app.get("/health")
async def health():
    return {"status": "ok"}


app.mount(
    "/frontend",
    StaticFiles(directory=Path(__file__).parent / "frontend" / "dist"),
    name="frontend",
)


@app.get("/{path:path}")
async def serve_frontend(path: str):
    if (
        path.startswith("api/")
        or path.startswith("frontend/")
        or path.startswith("docs")
        or path.startswith("/openapi")
        or path.startswith("/redoc")
        or path.startswith("/docs")
    ):
        return FileResponse(Path(__file__).parent / "frontend" / "dist" / "index.html")
    fp = Path(__file__).parent / "frontend" / "dist" / path
    if fp.is_file():
        return FileResponse(fp)
    return FileResponse(Path(__file__).parent / "frontend" / "dist" / "index.html")
