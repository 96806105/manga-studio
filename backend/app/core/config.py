from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Manga Studio"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000
    DATABASE_URL: str = "sqlite+aiosqlite:///./manga-studio.db"
    MODELS_DIR: str = "./models"
    EXPORTS_DIR: str = "./exports"
    AGNES_API_KEY: str = ""
    AGNES_BASE_URL: str = "https://apihub.agnes-ai.com/v1"
    MAX_VIDEO_DURATION: int = 10
    VIDEO_RESOLUTION: str = "480p"

    class Config:
        env_file = ".env"


settings = Settings()
