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
    """사용자가 추천 레시피를 바탕으로 작성한 공유 피드 게시글 테이블."""

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
    # 댓글과 좋아요는 게시글에 종속된 상호작용 데이터라 게시글 삭제 시 함께 삭제한다.
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
    """사용자와 게시글 사이의 좋아요 관계를 저장하는 테이블."""

    __tablename__ = "post_like"

    # user_id/post_id 복합 PK로 한 사용자가 같은 게시글을 한 번만 좋아요할 수 있게 한다.
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("user.user_id"), primary_key=True)
    post_id: Mapped[str] = mapped_column(String(36), ForeignKey("post.post_id"), primary_key=True)
    liked_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)

    user: Mapped[User] = relationship(back_populates="post_likes")
    post: Mapped[Post] = relationship(back_populates="likes")
