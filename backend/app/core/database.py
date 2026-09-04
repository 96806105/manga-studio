from sqlalchemy import create_engine, pool
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

SYNC_DB_URL = settings.DATABASE_URL.replace("sqlite+aiosqlite", "sqlite")
ASYNC_DB_URL = settings.DATABASE_URL

engine = create_engine(
    SYNC_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=pool.NullPool,
    echo=False,
)

async_engine = create_async_engine(
    ASYNC_DB_URL,
    echo=False,
    poolclass=pool.NullPool,
)

engine = create_engine(
    SYNC_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=pool.NullPool,
    echo=False,
)

async_engine = create_async_engine(
    ASYNC_DB_URL,
    echo=False,
    poolclass=pool.NullPool,
)

AsyncSessionLocal = async_sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)


def get_sync_db():
    with engine.connect() as connection:
        yield connection


async def get_async_db():
    async with AsyncSessionLocal() as session:
        yield session


Base = declarative_base()


def init_db():
    Base.metadata.create_all(bind=engine)
