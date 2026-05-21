from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.post import Post
from app.models.schemas import PostCreateRequest, PostUpdateRequest


class PostError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


def _utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def create_post(user_id: str, payload: PostCreateRequest, db: AsyncSession) -> Post:
    post = Post(
        author_id=user_id,
        source_recipe_id=payload.source_recipe_id,
        title=payload.title,
        description=payload.description,
        tip=payload.tip,
        cook_time=payload.cook_time,
        category=payload.category,
        difficulty=payload.difficulty,
        created_at=_utc_now(),
        updated_at=_utc_now(),
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


async def update_post(post_id: str, user_id: str, payload: PostUpdateRequest, db: AsyncSession) -> Post:
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "Post not found")
    if post.author_id != user_id:
        raise PostError(403, "Not authorized")

    if payload.title is not None:
        post.title = payload.title
    if payload.description is not None:
        post.description = payload.description
    if payload.tip is not None:
        post.tip = payload.tip
    if payload.cook_time is not None:
        post.cook_time = payload.cook_time
    if payload.category is not None:
        post.category = payload.category
    if payload.difficulty is not None:
        post.difficulty = payload.difficulty
    post.updated_at = _utc_now()

    await db.commit()
    await db.refresh(post)
    return post


async def delete_post(post_id: str, user_id: str, db: AsyncSession) -> None:
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "Post not found")
    if post.author_id != user_id:
        raise PostError(403, "Not authorized")

    await db.delete(post)
    await db.commit()
