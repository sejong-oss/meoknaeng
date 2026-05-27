from datetime import datetime

from sqlalchemy import delete, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.post import Comment, Post, PostLike
from app.models.recipe import Recipe, RecipeSave
from app.models.user import User, UserIngredient


async def delete_user_account(user: User, db: AsyncSession) -> None:
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


async def get_liked_posts(user_id: str, db: AsyncSession) -> list[tuple[Post, datetime]]:
    result = await db.execute(
        select(Post, PostLike.liked_at)
        .join(PostLike, PostLike.post_id == Post.post_id)
        .where(PostLike.user_id == user_id)
        .options(selectinload(Post.author))
        .order_by(PostLike.liked_at.desc())
    )
    return list(result.all())
