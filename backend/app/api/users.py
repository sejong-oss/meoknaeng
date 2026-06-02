from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.api.users_schemas import (
    LikedPostItem,
    LikedPostsResponse,
    MyPostItem,
    MyPostsResponse,
    SavedRecipeItem,
    SavedRecipesResponse,
    UserIngredientItem,
    UserIngredientsResponse,
    UserIngredientsUpdateRequest,
    UserProfileResponse,
    UserProfileUpdateRequest,
)
from app.db import get_db
from app.models.recipe import Recipe, RecipeSave
from app.models.schemas import ApiResponse
from app.models.user import User, UserIngredient
from app.service.users import (
    delete_user_account,
    get_liked_posts as get_liked_posts_service,
    get_my_posts as get_my_posts_service,
)

router = APIRouter(prefix="/users", tags=["users"])


def _utc_now() -> datetime:
    """DB에 저장할 naive UTC 시간을 생성한다."""
    return datetime.now(UTC).replace(tzinfo=None)


async def _get_current_user(user_id: str, db: AsyncSession) -> User:
    """세션의 user_id가 실제 사용자 row와 연결되는지 확인한다."""
    user = await db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="로그인이 필요합니다.",
        )
    return user


def _to_user_profile_response(user: User) -> UserProfileResponse:
    """User ORM 객체를 마이페이지 프로필 응답 DTO로 변환한다."""
    return UserProfileResponse(
        user_id=user.user_id,
        email=user.email,
        nickname=user.nickname,
        created_at=user.created_at,
    )


@router.get(
    "/me",
    response_model=ApiResponse[UserProfileResponse],
    summary="내 정보 조회",
)
async def get_my_profile(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[UserProfileResponse]:
    """현재 로그인 사용자의 프로필 정보를 반환한다."""
    user = await _get_current_user(user_id, db)
    return ApiResponse(success=True, data=_to_user_profile_response(user))


@router.patch(
    "/me",
    response_model=ApiResponse[UserProfileResponse],
    summary="내 정보 수정",
)
async def update_my_profile(
    payload: UserProfileUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[UserProfileResponse]:
    """현재 로그인 사용자의 수정 가능한 프로필 필드를 반영한다."""
    user = await _get_current_user(user_id, db)

    if payload.nickname is not None:
        user.nickname = payload.nickname

    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 사용 중인 닉네임입니다.",
        ) from exc

    await db.refresh(user)
    return ApiResponse(success=True, data=_to_user_profile_response(user))


@router.delete(
    "/me",
    response_model=ApiResponse[None],
    summary="회원 탈퇴",
)
async def delete_my_account(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
    """회원 탈퇴를 처리하고 현재 요청의 세션까지 함께 제거한다."""
    user = await _get_current_user(user_id, db)
    await delete_user_account(user, db)

    # 계정 삭제 후 같은 쿠키로 인증 API를 다시 호출하지 못하도록 세션을 즉시 비운다.
    request.session.clear()

    return ApiResponse(success=True, data=None)


@router.get(
    "/me/ingredients",
    response_model=ApiResponse[UserIngredientsResponse],
    summary="내 재료 조회",
)
async def get_my_ingredients(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[UserIngredientsResponse]:
    """검색창과 마이페이지에서 공통으로 사용하는 내 재료 목록을 반환한다."""
    await _get_current_user(user_id, db)

    result = await db.scalars(
        select(UserIngredient)
        .where(UserIngredient.user_id == user_id)
        .order_by(UserIngredient.created_at.asc())
    )
    ingredients = [
        UserIngredientItem(name=ingredient.ingredient_name)
        for ingredient in result.all()
    ]

    return ApiResponse(
        success=True,
        data=UserIngredientsResponse(ingredients=ingredients),
    )


@router.patch(
    "/me/ingredients",
    response_model=ApiResponse[UserIngredientsResponse],
    summary="내 재료 수정",
)
async def update_my_ingredients(
    payload: UserIngredientsUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[UserIngredientsResponse]:
    """프론트가 보낸 최종 재료 목록을 기준으로 내 재료를 전체 교체한다."""
    await _get_current_user(user_id, db)

    # 추가/삭제를 개별 API로 나누지 않고 최종 목록으로 동기화해 프론트 상태와 DB를 맞춘다.
    await db.execute(delete(UserIngredient).where(UserIngredient.user_id == user_id))

    now = _utc_now()
    for i, ingredient_name in enumerate(payload.ingredients):
        db.add(
            UserIngredient(
                user_id=user_id,
                ingredient_name=ingredient_name,
                created_at=now + timedelta(seconds=i),
            )
        )

    await db.commit()

    ingredients = [
        UserIngredientItem(name=ingredient_name)
        for ingredient_name in payload.ingredients
    ]
    return ApiResponse(
        success=True,
        data=UserIngredientsResponse(ingredients=ingredients),
    )


@router.get(
    "/me/saved-recipes",
    response_model=ApiResponse[SavedRecipesResponse],
    summary="저장 레시피 조회",
)
async def get_my_saved_recipes(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[SavedRecipesResponse]:
    """현재 사용자가 추천 상세 화면에서 저장한 레시피 목록을 반환한다."""
    await _get_current_user(user_id, db)

    result = await db.execute(
        select(Recipe, RecipeSave.saved_at)
        .join(RecipeSave, RecipeSave.recipe_id == Recipe.recipe_id)
        .where(RecipeSave.user_id == user_id)
        .order_by(RecipeSave.saved_at.desc())
    )
    recipes = [
        SavedRecipeItem(
            recipe_id=recipe.recipe_id,
            name=recipe.name,
            description=recipe.description,
            category=recipe.category,
            cook_time=recipe.cook_time,
            difficulty=recipe.difficulty,
            servings=recipe.servings,
            image_url=recipe.image_url,
            saved_at=saved_at,
        )
        for recipe, saved_at in result.all()
    ]

    return ApiResponse(
        success=True,
        data=SavedRecipesResponse(recipes=recipes),
    )


@router.get(
    "/me/posts",
    response_model=ApiResponse[MyPostsResponse],
    summary="내가 쓴 글 조회",
)
async def get_my_posts(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[MyPostsResponse]:
    """현재 사용자가 작성한 공유 게시글 목록을 반환한다."""
    await _get_current_user(user_id, db)

    rows = await get_my_posts_service(user_id, db)
    posts = [
        MyPostItem(
            post_id=post.post_id,
            title=post.title,
            description=post.description,
            cook_time=post.cook_time,
            category=post.category,
            difficulty=post.difficulty,
            like_count=like_count,
            created_at=post.created_at,
            updated_at=post.updated_at,
            source_recipe_id=post.source_recipe_id,
            source_recipe_image_url=post.source_recipe.image_url if post.source_recipe else None,
        )
        for post, like_count in rows
    ]

    return ApiResponse(success=True, data=MyPostsResponse(posts=posts))


@router.get(
    "/me/liked-posts",
    response_model=ApiResponse[LikedPostsResponse],
    summary="좋아요한 게시글 조회",
)
async def get_my_liked_posts(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[LikedPostsResponse]:
    """현재 사용자가 좋아요한 공유 게시글 목록을 반환한다."""
    await _get_current_user(user_id, db)

    rows = await get_liked_posts_service(user_id, db)
    posts = [
        LikedPostItem(
            post_id=post.post_id,
            title=post.title,
            description=post.description,
            cook_time=post.cook_time,
            category=post.category,
            difficulty=post.difficulty,
            like_count=like_count,
            author_nickname=post.author.nickname,
            created_at=post.created_at,
            liked_at=liked_at,
            source_recipe_image_url=post.source_recipe.image_url if post.source_recipe else None,
        )
        for post, liked_at, like_count in rows
    ]

    return ApiResponse(success=True, data=LikedPostsResponse(posts=posts))
