from datetime import datetime, timezone

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.post import Post, PostLike
from app.models.recipe import Recipe
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
        raise PostError(404, "게시글을 찾을 수 없습니다.")
    if post.author_id != user_id:
        raise PostError(403, "권한이 없습니다.")

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
        raise PostError(404, "게시글을 찾을 수 없습니다.")
    if post.author_id != user_id:
        raise PostError(403, "권한이 없습니다.")

    await db.execute(delete(PostLike).where(PostLike.post_id == post_id))
    await db.delete(post)
    await db.commit()


async def like_post(post_id: str, user_id: str, db: AsyncSession) -> None:
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")

    existing_like = await db.get(PostLike, {"user_id": user_id, "post_id": post_id})
    if existing_like:
        raise PostError(409, "이미 좋아요한 게시글입니다.")

    db.add(PostLike(user_id=user_id, post_id=post_id, liked_at=_utc_now()))
    await db.commit()


async def unlike_post(post_id: str, user_id: str, db: AsyncSession) -> None:
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")

    post_like = await db.get(PostLike, {"user_id": user_id, "post_id": post_id})
    if not post_like:
        raise PostError(404, "좋아요한 게시글을 찾을 수 없습니다.")

    await db.delete(post_like)
    await db.commit()


async def get_post_list(
    db: AsyncSession,
    page: int,
    size: int,
    q: str | None,
    category: str | None,
    difficulty: str | None,
) -> tuple[list[Post], int]:
    filters = []
    if q:
        filters.append(Post.title.ilike(f"%{q}%"))
    if category:
        filters.append(Post.category == category)
    if difficulty:
        filters.append(Post.difficulty == difficulty)

    total = (await db.execute(
        select(func.count(Post.post_id)).filter(*filters)
    )).scalar_one()

    stmt = (
        select(Post)
        .filter(*filters)
        .options(selectinload(Post.author), selectinload(Post.source_recipe))
        .order_by(Post.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
    )
    posts = (await db.execute(stmt)).scalars().all()
    return list(posts), total


async def get_post_detail(post_id: str, db: AsyncSession) -> Post:
    stmt = (
        select(Post)
        .options(
            selectinload(Post.author),
            selectinload(Post.source_recipe).selectinload(Recipe.ingredients),
            selectinload(Post.source_recipe).selectinload(Recipe.steps),
        )
        .where(Post.post_id == post_id)
    )
    post = (await db.execute(stmt)).scalar_one_or_none()
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")
    return post
