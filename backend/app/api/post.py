from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.db import get_db
from app.models.schemas import (
    ApiResponse,
    PostCreateRequest,
    PostDetailResponse,
    PostListItem,
    PostListResponse,
    PostResponse,
    PostUpdateRequest,
    RecipeDetail,
    RecipeDetailIngredient,
    RecipeDetailStep,
    RecipeSummary,
)
from app.service.post import (
    PostError,
    create_post,
    delete_post,
    get_post_detail,
    get_post_list,
    like_post,
    unlike_post,
    update_post,
)

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
        created_at=post.created_at.isoformat(),
        updated_at=post.updated_at.isoformat(),
    )


def _to_list_item(post) -> PostListItem:
    recipe = None
    if post.source_recipe:
        r = post.source_recipe
        recipe = RecipeSummary(
            recipe_id=r.recipe_id,
            name=r.name,
            description=r.description,
            cook_time=r.cook_time,
            difficulty=r.difficulty,
            servings=r.servings,
        )
    return PostListItem(
        post_id=post.post_id,
        title=post.title,
        description=post.description,
        cook_time=post.cook_time,
        category=post.category,
        difficulty=post.difficulty,
        author_nickname=post.author.nickname,
        created_at=post.created_at.isoformat(),
        source_recipe=recipe,
    )


def _to_detail(post) -> PostDetailResponse:
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
        cook_time=post.cook_time,
        category=post.category,
        difficulty=post.difficulty,
        source_recipe_id=post.source_recipe_id,
        created_at=post.created_at.isoformat(),
        updated_at=post.updated_at.isoformat(),
        source_recipe=recipe,
    )


@router.get("", response_model=ApiResponse[PostListResponse])
async def get_post_list_handler(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
    category: str | None = Query(None),
    difficulty: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[PostListResponse]:
    posts, total = await get_post_list(db, page, size, q, category, difficulty)
    return ApiResponse(
        success=True,
        data=PostListResponse(
            posts=[_to_list_item(p) for p in posts],
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
    try:
        post = await get_post_detail(post_id, db)
        return ApiResponse(success=True, data=_to_detail(post))
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


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


@router.patch("/{post_id}", response_model=ApiResponse[PostResponse])
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


@router.post("/{post_id}/likes", response_model=ApiResponse[None])
async def like_post_handler(
    post_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
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
    try:
        await unlike_post(post_id, user_id, db)
        return ApiResponse(success=True, data=None)
    except PostError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
