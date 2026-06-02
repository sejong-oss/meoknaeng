from typing import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import DATABASE_URL


class Base(DeclarativeBase):
    """모든 SQLAlchemy ORM 모델의 공통 베이스 클래스."""


def _normalize_async_url(url: str) -> str:
    """배포 환경의 MySQL URL을 SQLAlchemy async driver URL로 변환한다."""
    if url.startswith("mysql://"):
        return url.replace("mysql://", "mysql+asyncmy://", 1)
    return url


# DATABASE_URL이 없는 환경에서도 앱 import가 가능하도록 engine 생성을 지연한다.
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
    """FastAPI 요청 단위로 비동기 DB 세션을 제공하는 의존성이다."""
    if AsyncSessionLocal is None:
        raise RuntimeError("DATABASE_URL is not configured")
    async with AsyncSessionLocal() as session:
        yield session
