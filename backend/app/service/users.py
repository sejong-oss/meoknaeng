from datetime import datetime

from sqlalchemy import delete, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.post import Comment, Post, PostLike
from app.models.recipe import Recipe, RecipeSave
from app.models.user import User, UserIngredient


async def delete_user_account(user: User, db: AsyncSession) -> None:
    """사용자 계정과 개인 데이터를 삭제한다.

    FK 제약을 피하기 위해 사용자가 작성한 댓글/게시글 관련 데이터를 먼저
    정리하고, 저장 레시피와 내 재료를 삭제한 뒤 마지막에 사용자 row를 삭제한다.
    """
    user_id = user.user_id
    user_post_ids = select(Post.post_id).where(Post.author_id == user_id)

    # 본인이 쓴 댓글과 본인 게시글에 달린 댓글을 함께 삭제해 고아 댓글을 남기지 않는다.
    await db.execute(
        delete(Comment).where(
            or_(Comment.author_id == user_id, Comment.post_id.in_(user_post_ids))
        )
    )
    # 본인이 누른 좋아요와 본인 게시글이 받은 좋아요를 함께 삭제한다.
    await db.execute(
        delete(PostLike).where(
            or_(PostLike.user_id == user_id, PostLike.post_id.in_(user_post_ids))
        )
    )
    await db.execute(delete(Post).where(Post.author_id == user_id))
    await db.execute(delete(RecipeSave).where(RecipeSave.user_id == user_id))
    await db.execute(delete(UserIngredient).where(UserIngredient.user_id == user_id))
    # 추천 레시피 자체는 공유/저장 참조가 남을 수 있으므로 작성자 연결만 끊는다.
    await db.execute(
        update(Recipe).where(Recipe.created_by == user_id).values(created_by=None)
    )
    await db.delete(user)
    await db.commit()


async def get_liked_posts(user_id: str, db: AsyncSession) -> list[tuple[Post, datetime, int]]:
    """사용자가 좋아요한 게시글 목록을 좋아요 일시 내림차순으로 반환한다."""
    # 마이페이지 카드에 필요한 좋아요 수를 별도 count query 없이 함께 계산한다.
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
    # 내가 쓴 글 카드도 피드 목록과 동일하게 현재 좋아요 수를 함께 내려준다.
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
