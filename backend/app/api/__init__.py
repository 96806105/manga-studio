from fastapi import APIRouter
from .projects import router as projects_router
from .scenes import router as scenes_router
from .shots import router as shots_router
from .generation import router as generation_router
from .export import router as export_router

router = APIRouter()
router.include_router(projects_router)
router.include_router(scenes_router)
router.include_router(shots_router)
router.include_router(generation_router)
router.include_router(export_router)
