from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.api.users_schemas import (
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

router = APIRouter(prefix="/users", tags=["users"])


def _utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


async def _get_current_user(user_id: str, db: AsyncSession) -> User:
    user = await db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return user


def _to_user_profile_response(user: User) -> UserProfileResponse:
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
    user = await _get_current_user(user_id, db)
    return ApiResponse(success=True, data=_to_user_profile_response(user))


@router.put(
    "/me",
    response_model=ApiResponse[UserProfileResponse],
    summary="내 정보 수정",
)
async def update_my_profile(
    payload: UserProfileUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[UserProfileResponse]:
    user = await _get_current_user(user_id, db)

    if payload.nickname is not None:
        user.nickname = payload.nickname

    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Nickname already exists",
        ) from exc

    await db.refresh(user)
    return ApiResponse(success=True, data=_to_user_profile_response(user))


@router.get(
    "/me/ingredients",
    response_model=ApiResponse[UserIngredientsResponse],
    summary="내 재료 조회",
)
async def get_my_ingredients(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[UserIngredientsResponse]:
    await _get_current_user(user_id, db)

    result = await db.scalars(
        select(UserIngredient)
        .where(UserIngredient.user_id == user_id)
        .order_by(UserIngredient.created_at.asc(), UserIngredient.ingredient_name.asc())
    )
    ingredients = [
        UserIngredientItem(name=ingredient.ingredient_name)
        for ingredient in result.all()
    ]

    return ApiResponse(
        success=True,
        data=UserIngredientsResponse(ingredients=ingredients),
    )


@router.put(
    "/me/ingredients",
    response_model=ApiResponse[UserIngredientsResponse],
    summary="내 재료 수정",
)
async def update_my_ingredients(
    payload: UserIngredientsUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[UserIngredientsResponse]:
    await _get_current_user(user_id, db)

    await db.execute(delete(UserIngredient).where(UserIngredient.user_id == user_id))

    now = _utc_now()
    for ingredient_name in payload.ingredients:
        db.add(
            UserIngredient(
                user_id=user_id,
                ingredient_name=ingredient_name,
                created_at=now,
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
            saved_at=saved_at,
        )
        for recipe, saved_at in result.all()
    ]

    return ApiResponse(
        success=True,
        data=SavedRecipesResponse(recipes=recipes),
    )
