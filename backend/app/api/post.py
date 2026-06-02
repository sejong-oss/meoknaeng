from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.db import get_db
from app.models.schemas import (
    ApiResponse,
    CommentCreateRequest,
    CommentListResponse,
    CommentResponse,
    CommentUpdateRequest,
    PostCreateRequest,
    PostDetailResponse,
    PostListItem,
    PostListResponse,
    PostResponse,
    PostUpdateRequest,
    RecipeDetail,
    RecipeDetailIngredient,
    RecipeDetailStep,
)
from app.service.post import (
    PostError,
    create_comment,
    create_post,
    delete_comment,
    delete_post,
    get_comments,
    get_post_detail,
    get_post_list,
    like_post,
    unlike_post,
    update_comment,
    update_post,
)

router = APIRouter(prefix="/posts", tags=["posts"])


def _to_response(post) -> PostResponse:
    """Post ORM 객체를 작성/수정 API의 응답 DTO로 변환한다."""
    return PostResponse(
        post_id=post.post_id,
        author_id=post.author_id,
        title=post.title,
        description=post.description,
        tip=post.tip,
        cook_time=post.cook_time,
        category=post.category,
        difficulty=post.difficulty,
        source_recipe_id=post.source_recipe_id,
        created_at=post.created_at.isoformat(),
        updated_at=post.updated_at.isoformat(),
    )


def _to_list_item(post, like_count: int) -> PostListItem:
    """피드 목록 카드에 필요한 필드만 추려 PostListItem으로 변환한다."""
    return PostListItem(
        post_id=post.post_id,
        title=post.title,
        cook_time=post.cook_time,
        category=post.category,
        difficulty=post.difficulty,
        author_nickname=post.author.nickname,
        like_count=like_count,
        created_at=post.created_at.isoformat(),
        source_recipe_image_url=post.source_recipe.image_url if post.source_recipe else None,
    )


def _to_detail(post, like_count: int) -> PostDetailResponse:
    """게시글 상세 응답을 구성하고, 원본 레시피가 있으면 상세 DTO로 함께 포함한다."""
    recipe = None
    if post.source_recipe:
        r = post.source_recipe
        recipe = RecipeDetail(
            recipe_id=r.recipe_id,
            name=r.name,
            description=r.description,
            category=r.category,
            cook_time=r.cook_time,
            difficulty=r.difficulty,
            servings=r.servings,
            image_url=r.image_url,
            ingredients=[RecipeDetailIngredient(name=i.name, amount=i.amount) for i in r.ingredients],
            steps=[
                RecipeDetailStep(order=s.step_order, description=s.description)
                for s in sorted(r.steps, key=lambda s: s.step_order)
            ],
        )
    return PostDetailResponse(
        post_id=post.post_id,
        author_id=post.author_id,
        author_nickname=post.author.nickname,
        title=post.title,
        description=post.description,
        tip=post.tip,
        like_count=like_count,
        created_at=post.created_at.isoformat(),
        updated_at=post.updated_at.isoformat(),
        source_recipe=recipe,
    )


def _to_comment_response(comment) -> CommentResponse:
    """Comment ORM 객체를 프론트 댓글 응답 DTO로 변환한다."""
    return CommentResponse(
        comment_id=comment.comment_id,
        post_id=comment.post_id,
        author_id=comment.author_id,
        author_nickname=comment.author.nickname,
        content=comment.content,
        created_at=comment.created_at.isoformat(),
    )


@router.get("", response_model=ApiResponse[PostListResponse])
async def get_post_list_handler(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    category: str | None = Query(None),
    difficulty: str | None = Query(None),
    cook_time_max: int | None = Query(None, ge=1, alias="cookTimeMax"),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[PostListResponse]:
    """검색/필터/페이지네이션 조건에 맞는 공유 피드 목록을 반환한다."""
    posts_with_counts, total = await get_post_list(db, page, size, q, category, difficulty, cook_time_max)
    return ApiResponse(
        success=True,
        data=PostListResponse(
            posts=[_to_list_item(p, c) for p, c in posts_with_counts],
            total=total,
            page=page,
            size=size,
        ),
    )


@router.get("/{post_id}", response_model=ApiResponse[PostDetailResponse])
async def get_post_detail_handler(
    post_id: str,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[PostDetailResponse]:
    """공유 게시글 상세 정보를 원본 레시피와 좋아요 수까지 포함해 반환한다."""
    try:
        post, like_count = await get_post_detail(post_id, db)
        return ApiResponse(success=True, data=_to_detail(post, like_count))
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.get("/{post_id}/comments", response_model=ApiResponse[CommentListResponse])
async def get_comments_handler(
    post_id: str,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[CommentListResponse]:
    """게시글에 달린 댓글 목록을 조회한다."""
    try:
        comments = await get_comments(post_id, db)
        return ApiResponse(
            success=True,
            data=CommentListResponse(
                comments=[_to_comment_response(comment) for comment in comments]
            ),
        )
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.post(
    "/{post_id}/comments",
    response_model=ApiResponse[CommentResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_comment_handler(
    post_id: str,
    payload: CommentCreateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[CommentResponse]:
    """로그인 사용자가 게시글에 댓글을 작성한다."""
    try:
        comment = await create_comment(post_id, user_id, payload, db)
        return ApiResponse(success=True, data=_to_comment_response(comment))
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.patch(
    "/{post_id}/comments/{comment_id}",
    response_model=ApiResponse[CommentResponse],
)
async def update_comment_handler(
    post_id: str,
    comment_id: str,
    payload: CommentUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[CommentResponse]:
    """댓글 작성자 본인이 댓글 내용을 수정한다."""
    try:
        comment = await update_comment(post_id, comment_id, user_id, payload, db)
        return ApiResponse(success=True, data=_to_comment_response(comment))
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.delete("/{post_id}/comments/{comment_id}", response_model=ApiResponse[None])
async def delete_comment_handler(
    post_id: str,
    comment_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
    """댓글 작성자 본인이 댓글을 삭제한다."""
    try:
        await delete_comment(post_id, comment_id, user_id, db)
        return ApiResponse(success=True, data=None)
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.post("", response_model=ApiResponse[PostResponse], status_code=status.HTTP_201_CREATED)
async def create_post_handler(
    payload: PostCreateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[PostResponse]:
    """로그인 사용자가 공유 게시글을 새로 작성한다."""
    try:
        post = await create_post(user_id, payload, db)
        return ApiResponse(success=True, data=_to_response(post))
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.patch("/{post_id}", response_model=ApiResponse[PostResponse])
async def update_post_handler(
    post_id: str,
    payload: PostUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[PostResponse]:
    """게시글 작성자 본인이 공유 게시글을 수정한다."""
    try:
        post = await update_post(post_id, user_id, payload, db)
        return ApiResponse(success=True, data=_to_response(post))
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.delete("/{post_id}", response_model=ApiResponse[None])
async def delete_post_handler(
    post_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
    """게시글 작성자 본인이 공유 게시글을 삭제한다."""
    try:
        await delete_post(post_id, user_id, db)
        return ApiResponse(success=True, data=None)
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.post(
    "/{post_id}/likes",
    response_model=ApiResponse[None],
    status_code=status.HTTP_201_CREATED,
)
async def like_post_handler(
    post_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
    """로그인 사용자가 공유 게시글에 좋아요를 추가한다."""
    try:
        await like_post(post_id, user_id, db)
        return ApiResponse(success=True, data=None)
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.delete("/{post_id}/likes", response_model=ApiResponse[None])
async def unlike_post_handler(
    post_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
    """로그인 사용자가 공유 게시글 좋아요를 취소한다."""
    try:
        await unlike_post(post_id, user_id, db)
        return ApiResponse(success=True, data=None)
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
