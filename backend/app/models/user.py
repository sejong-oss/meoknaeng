from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from app.models.recipe import RecipeSave
    from app.models.post import Comment, Post, PostLike


class User(Base):
    """사용자 계정 정보를 저장하고 인증·마이페이지 데이터의 기준이 되는 테이블."""

    __tablename__ = "user"

    user_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    nickname: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)

    # 내 재료와 저장 레시피는 사용자 개인 데이터라 계정 삭제 시 함께 제거한다.
    ingredients: Mapped[list[UserIngredient]] = relationship(back_populates="user", cascade="all, delete-orphan")
    recipe_saves: Mapped[list[RecipeSave]] = relationship(back_populates="user", cascade="all, delete-orphan")
    posts: Mapped[list[Post]] = relationship(back_populates="author")
    comments: Mapped[list[Comment]] = relationship(back_populates="author")
    post_likes: Mapped[list[PostLike]] = relationship(back_populates="user", cascade="all, delete-orphan")


class UserIngredient(Base):
    """사용자가 보유한 재료 목록을 저장하는 테이블."""

    __tablename__ = "user_ingredient"

    # user_id와 ingredient_name을 복합 PK로 사용해 같은 재료가 중복 저장되지 않도록 한다.
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("user.user_id"), primary_key=True)
    ingredient_name: Mapped[str] = mapped_column(String(50), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)

    user: Mapped[User] = relationship(back_populates="ingredients")
