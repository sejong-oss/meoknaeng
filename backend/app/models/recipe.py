from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text, TIMESTAMP, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.post import Post


class Recipe(Base):
    """AI가 추천한 레시피 기본 정보를 저장하는 테이블."""

    __tablename__ = "recipe"

    recipe_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str | None] = mapped_column(Text)
    cook_time: Mapped[int | None] = mapped_column(Integer)
    difficulty: Mapped[str | None] = mapped_column(String(20))
    servings: Mapped[int | None] = mapped_column(Integer)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.user_id"))
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)

    ingredients: Mapped[list[RecipeIngredient]] = relationship(back_populates="recipe", cascade="all, delete-orphan")
    steps: Mapped[list[RecipeStep]] = relationship(back_populates="recipe", cascade="all, delete-orphan")
    saves: Mapped[list[RecipeSave]] = relationship(back_populates="recipe", cascade="all, delete-orphan")
    videos: Mapped[list[RecipeVideo]] = relationship(back_populates="recipe", cascade="all, delete-orphan")
    posts: Mapped[list[Post]] = relationship(back_populates="source_recipe")


class RecipeIngredient(Base):
    """레시피에 필요한 재료와 분량을 저장하는 테이블."""

    __tablename__ = "recipe_ingredient"

    ingredient_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    recipe_id: Mapped[str] = mapped_column(String(36), ForeignKey("recipe.recipe_id"))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[str] = mapped_column(Text, nullable=False)

    recipe: Mapped[Recipe] = relationship(back_populates="ingredients")


class RecipeStep(Base):
    """레시피의 조리 단계별 설명을 저장하는 테이블."""

    __tablename__ = "recipe_step"
    __table_args__ = (UniqueConstraint("recipe_id", "order"),)

    step_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    recipe_id: Mapped[str] = mapped_column(String(36), ForeignKey("recipe.recipe_id"))
    step_order: Mapped[int] = mapped_column("order", Integer, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    recipe: Mapped[Recipe] = relationship(back_populates="steps")


class RecipeSave(Base):
    """사용자가 저장한 레시피 관계를 저장하는 테이블."""

    __tablename__ = "recipe_save"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("user.user_id"), primary_key=True)
    recipe_id: Mapped[str] = mapped_column(String(36), ForeignKey("recipe.recipe_id"), primary_key=True)
    saved_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)

    user: Mapped[User] = relationship(back_populates="recipe_saves")
    recipe: Mapped[Recipe] = relationship(back_populates="saves")


class RecipeVideo(Base):
    """레시피 관련 YouTube 영상 정보를 캐싱하는 테이블."""

    __tablename__ = "recipe_video"

    recipe_id: Mapped[str] = mapped_column(String(36), ForeignKey("recipe.recipe_id"), primary_key=True)
    video_id: Mapped[str] = mapped_column(String(20), primary_key=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    thumbnail_url: Mapped[str] = mapped_column(Text, nullable=False)
    video_url: Mapped[str] = mapped_column(Text, nullable=False)

    recipe: Mapped[Recipe] = relationship(back_populates="videos")
