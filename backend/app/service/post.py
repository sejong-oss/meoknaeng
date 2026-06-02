from datetime import datetime, timezone

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.post import Comment, Post, PostLike
from app.models.recipe import Recipe
from app.models.schemas import (
    CommentCreateRequest,
    CommentUpdateRequest,
    PostCreateRequest,
    PostUpdateRequest,
)


class PostError(Exception):
    """게시글/댓글 관련 서비스 에러. status_code와 메시지를 포함한다."""

    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


def _utc_now() -> datetime:
    """DB에 저장할 naive UTC 시간을 생성한다."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def create_post(user_id: str, payload: PostCreateRequest, db: AsyncSession) -> Post:
    """로그인 사용자가 원본 레시피를 바탕으로 공유 게시글을 생성한다."""
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
    """게시글을 수정한다. 작성자 본인만 수정 가능하다."""
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
    """게시글과 연관 좋아요를 삭제한다. 작성자 본인만 삭제 가능하다."""
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")
    if post.author_id != user_id:
        raise PostError(403, "권한이 없습니다.")

    # post_like는 복합 PK 관계 테이블이라 게시글 삭제 전에 명시적으로 먼저 정리한다.
    await db.execute(delete(PostLike).where(PostLike.post_id == post_id))
    await db.delete(post)
    await db.commit()


async def like_post(post_id: str, user_id: str, db: AsyncSession) -> None:
    """게시글에 좋아요를 추가한다. 이미 좋아요한 경우 에러."""
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")

    # post_like의 복합 PK를 그대로 조회해 중복 좋아요를 빠르게 판별한다.
    existing_like = await db.get(PostLike, {"user_id": user_id, "post_id": post_id})
    if existing_like:
        raise PostError(409, "이미 좋아요한 게시글입니다.")

    db.add(PostLike(user_id=user_id, post_id=post_id, liked_at=_utc_now()))
    await db.commit()


async def unlike_post(post_id: str, user_id: str, db: AsyncSession) -> None:
    """게시글 좋아요를 취소한다."""
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")

    post_like = await db.get(PostLike, {"user_id": user_id, "post_id": post_id})
    if not post_like:
        raise PostError(404, "좋아요한 게시글을 찾을 수 없습니다.")

    await db.delete(post_like)
    await db.commit()


async def get_comments(post_id: str, db: AsyncSession) -> list[Comment]:
    """게시글의 댓글 목록을 작성일 오름차순으로 반환한다."""
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")

    result = await db.execute(
        select(Comment)
        .where(Comment.post_id == post_id)
        .options(selectinload(Comment.author))
        .order_by(Comment.created_at.asc())
    )
    return list(result.scalars().all())


async def create_comment(
    post_id: str,
    user_id: str,
    payload: CommentCreateRequest,
    db: AsyncSession,
) -> Comment:
    """게시글에 댓글을 작성하고 작성자 정보를 포함한 최신 댓글 row를 반환한다."""
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")

    comment = Comment(
        post_id=post_id,
        author_id=user_id,
        content=payload.content,
        created_at=_utc_now(),
    )
    db.add(comment)
    await db.commit()

    # commit 후 author 관계를 포함한 응답 매핑을 위해 단건 조회 함수로 다시 읽는다.
    return await get_comment(post_id, comment.comment_id, db)


async def update_comment(
    post_id: str,
    comment_id: str,
    user_id: str,
    payload: CommentUpdateRequest,
    db: AsyncSession,
) -> Comment:
    """댓글을 수정한다. 작성자 본인만 수정 가능하다."""
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")

    comment = await get_comment(post_id, comment_id, db)
    if comment.author_id != user_id:
        raise PostError(403, "권한이 없습니다.")

    comment.content = payload.content
    await db.commit()
    # 수정 후에도 목록/단건 응답과 같은 형태가 되도록 author를 eager load한 row를 반환한다.
    return await get_comment(post_id, comment.comment_id, db)


async def delete_comment(
    post_id: str,
    comment_id: str,
    user_id: str,
    db: AsyncSession,
) -> None:
    """댓글을 삭제한다. 작성자 본인만 삭제 가능하다."""
    post = await db.get(Post, post_id)
    if not post:
        raise PostError(404, "게시글을 찾을 수 없습니다.")

    comment = await get_comment(post_id, comment_id, db)
    if comment.author_id != user_id:
        raise PostError(403, "권한이 없습니다.")

    await db.delete(comment)
    await db.commit()


async def get_comment(post_id: str, comment_id: str, db: AsyncSession) -> Comment:
    """댓글 단건을 조회한다. 없으면 에러."""
    result = await db.execute(
        select(Comment)
        .where(Comment.comment_id == comment_id, Comment.post_id == post_id)
        .options(selectinload(Comment.author))
    )
    comment = result.scalar_one_or_none()
    if not comment:
        raise PostError(404, "댓글을 찾을 수 없습니다.")
    return comment


async def get_post_list(
    db: AsyncSession,
    page: int,
    size: int,
    q: str | None,
    category: str | None,
    difficulty: str | None,
    cook_time_max: int | None,
) -> tuple[list[tuple[Post, int]], int]:
    """검색·필터 조건으로 게시글 목록과 전체 개수를 페이지네이션하여 반환한다."""
    filters = []
    if q:
        filters.append(Post.title.ilike(f"%{q}%"))
    if category:
        filters.append(Post.category == category)
    if difficulty:
        filters.append(Post.difficulty == difficulty)
    if cook_time_max is not None:
        filters.append(Post.cook_time <= cook_time_max)

    # 페이지네이션 UI가 전체 개수를 알 수 있도록 같은 필터 조건으로 count를 먼저 계산한다.
    total = (await db.execute(
        select(func.count(Post.post_id)).filter(*filters)
    )).scalar_one()

    # 좋아요 수는 post_like row 수를 correlated subquery로 계산해 목록 응답에 함께 싣는다.
    like_count_subq = (
        select(func.count(PostLike.post_id))
        .where(PostLike.post_id == Post.post_id)
        .correlate(Post)
        .scalar_subquery()
    )

    stmt = (
        select(Post, like_count_subq.label("like_count"))
        .filter(*filters)
        .options(
            # async lazy loading을 피하기 위해 카드에 필요한 작성자와 대표 이미지를 미리 로드한다.
            selectinload(Post.author),
            selectinload(Post.source_recipe),
        )
        .order_by(Post.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
    )
    rows = (await db.execute(stmt)).all()
    return [(post, like_count) for post, like_count in rows], total


async def get_post_detail(post_id: str, db: AsyncSession) -> tuple[Post, int]:
    """게시글 상세를 작성자·원본 레시피(재료·단계 포함)와 함께 조회한다. 없으면 에러."""
    # 상세 화면에서도 목록과 동일한 기준의 좋아요 수를 보여주기 위해 같은 집계 방식을 사용한다.
    like_count_subq = (
        select(func.count(PostLike.post_id))
        .where(PostLike.post_id == Post.post_id)
        .correlate(Post)
        .scalar_subquery()
    )

    stmt = (
        select(Post, like_count_subq.label("like_count"))
        .options(
            # 상세 화면은 원본 레시피의 재료/조리 단계까지 보여주므로 관계를 한 번에 로드한다.
            selectinload(Post.author),
            selectinload(Post.source_recipe).selectinload(Recipe.ingredients),
            selectinload(Post.source_recipe).selectinload(Recipe.steps),
        )
        .where(Post.post_id == post_id)
    )
    row = (await db.execute(stmt)).one_or_none()
    if not row:
        raise PostError(404, "게시글을 찾을 수 없습니다.")

    post, like_count = row
    return post, like_count
