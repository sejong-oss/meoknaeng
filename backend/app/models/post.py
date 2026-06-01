from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.recipe import Recipe


class Post(Base):
    """사용자가 작성한 레시피 공유 게시글을 저장하는 테이블."""

    __tablename__ = "post"

    post_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("user.user_id"), nullable=False)
    source_recipe_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("recipe.recipe_id"))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    tip: Mapped[str | None] = mapped_column(String(200))
    cook_time: Mapped[int | None] = mapped_column(Integer)
    category: Mapped[str | None] = mapped_column(Text)
    difficulty: Mapped[str | None] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)

    author: Mapped[User] = relationship(back_populates="posts")
    source_recipe: Mapped[Recipe | None] = relationship(back_populates="posts")
    comments: Mapped[list[Comment]] = relationship(back_populates="post", cascade="all, delete-orphan")
    likes: Mapped[list[PostLike]] = relationship(back_populates="post", cascade="all, delete-orphan")


class Comment(Base):
    """게시글에 달린 댓글을 저장하는 테이블."""

    __tablename__ = "comment"

    comment_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id: Mapped[str] = mapped_column(String(36), ForeignKey("post.post_id"), nullable=False)
    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("user.user_id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)

    post: Mapped[Post] = relationship(back_populates="comments")
    author: Mapped[User] = relationship(back_populates="comments")


class PostLike(Base):
    """게시글 좋아요 관계를 저장하는 테이블."""

    __tablename__ = "post_like"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("user.user_id"), primary_key=True)
    post_id: Mapped[str] = mapped_column(String(36), ForeignKey("post.post_id"), primary_key=True)
    liked_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)

    user: Mapped[User] = relationship(back_populates="post_likes")
    post: Mapped[Post] = relationship(back_populates="likes")
