from typing import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import DATABASE_URL


class Base(DeclarativeBase):
    pass


def _normalize_async_url(url: str) -> str:
    if url.startswith("mysql://"):
        return url.replace("mysql://", "mysql+asyncmy://", 1)
    return url


engine = (
    create_async_engine(_normalize_async_url(DATABASE_URL), pool_pre_ping=True)
    if DATABASE_URL
    else None
)
AsyncSessionLocal = (
    async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    if engine
    else None
)


async def get_db() -> AsyncIterator[AsyncSession]:
    if AsyncSessionLocal is None:
        raise RuntimeError("DATABASE_URL is not configured")
    async with AsyncSessionLocal() as session:
        yield session
