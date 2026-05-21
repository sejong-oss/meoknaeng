from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.db import get_db
from app.models.schemas import ApiResponse, PostCreateRequest, PostResponse, PostUpdateRequest
from app.service.post import PostError, create_post, delete_post, update_post

router = APIRouter(prefix="/posts", tags=["posts"])


def _to_response(post) -> PostResponse:
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
        comment_count=post.comment_count,
        created_at=post.created_at.isoformat(),
        updated_at=post.updated_at.isoformat(),
    )


@router.post("", response_model=ApiResponse[PostResponse], status_code=status.HTTP_201_CREATED)
async def create_post_handler(
    payload: PostCreateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[PostResponse]:
    try:
        post = await create_post(user_id, payload, db)
        return ApiResponse(success=True, data=_to_response(post))
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.put("/{post_id}", response_model=ApiResponse[PostResponse])
async def update_post_handler(
    post_id: str,
    payload: PostUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[PostResponse]:
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
    try:
        await delete_post(post_id, user_id, db)
        return ApiResponse(success=True, data=None)
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
