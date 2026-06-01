from datetime import datetime

from sqlalchemy import delete, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.post import Comment, Post, PostLike
from app.models.recipe import Recipe, RecipeSave
from app.models.user import User, UserIngredient


async def delete_user_account(user: User, db: AsyncSession) -> None:
    """사용자 계정과 연관된 댓글·좋아요·게시글·저장 레시피·재료를 모두 삭제한다."""
    user_id = user.user_id
    user_post_ids = select(Post.post_id).where(Post.author_id == user_id)

    await db.execute(
        delete(Comment).where(
            or_(Comment.author_id == user_id, Comment.post_id.in_(user_post_ids))
        )
    )
    await db.execute(
        delete(PostLike).where(
            or_(PostLike.user_id == user_id, PostLike.post_id.in_(user_post_ids))
        )
    )
    await db.execute(delete(Post).where(Post.author_id == user_id))
    await db.execute(delete(RecipeSave).where(RecipeSave.user_id == user_id))
    await db.execute(delete(UserIngredient).where(UserIngredient.user_id == user_id))
    await db.execute(
        update(Recipe).where(Recipe.created_by == user_id).values(created_by=None)
    )
    await db.delete(user)
    await db.commit()


async def get_liked_posts(user_id: str, db: AsyncSession) -> list[tuple[Post, datetime, int]]:
    """사용자가 좋아요한 게시글 목록을 좋아요 일시 내림차순으로 반환한다."""
    like_count_subq = (
        select(func.count(PostLike.post_id))
        .where(PostLike.post_id == Post.post_id)
        .correlate(Post)
        .scalar_subquery()
    )
    result = await db.execute(
        select(Post, PostLike.liked_at, like_count_subq.label("like_count"))
        .join(PostLike, PostLike.post_id == Post.post_id)
        .where(PostLike.user_id == user_id)
        .options(
            selectinload(Post.author),
            selectinload(Post.source_recipe),
        )
        .order_by(PostLike.liked_at.desc())
    )
    return list(result.all())


async def get_my_posts(user_id: str, db: AsyncSession) -> list[tuple[Post, int]]:
    """사용자가 작성한 게시글 목록을 작성일 내림차순으로 반환한다."""
    like_count_subq = (
        select(func.count(PostLike.post_id))
        .where(PostLike.post_id == Post.post_id)
        .correlate(Post)
        .scalar_subquery()
    )
    result = await db.execute(
        select(Post, like_count_subq.label("like_count"))
        .where(Post.author_id == user_id)
        .options(selectinload(Post.source_recipe))
        .order_by(Post.created_at.desc())
    )
    return list(result.all())
