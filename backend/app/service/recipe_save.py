from datetime import datetime, timezone

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.recipe import Recipe, RecipeIngredient, RecipeStep, RecipeSave


class RecipeSaveError(Exception):
    """레시피 저장/조회 관련 서비스 에러. status_code와 메시지를 포함한다."""

    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


async def save_recipe(user_id: str, recipe_id: str, db: AsyncSession) -> None:
    """레시피를 사용자 저장 목록에 추가한다. 없는 레시피거나 이미 저장된 경우 에러."""
    recipe = await db.get(Recipe, recipe_id)
    if not recipe:
        raise RecipeSaveError(404, "레시피를 찾을 수 없습니다.")

    existing = await db.execute(
        select(RecipeSave).where(
            RecipeSave.user_id == user_id,
            RecipeSave.recipe_id == recipe_id,
        )
    )
    if existing.scalar_one_or_none():
        raise RecipeSaveError(409, "이미 저장된 레시피입니다.")

    # recipe_save는 user_id/recipe_id 복합 PK로 한 사용자의 중복 저장을 막는다.
    db.add(RecipeSave(
        user_id=user_id,
        recipe_id=recipe_id,
        saved_at=datetime.now(timezone.utc),
    ))
    await db.commit()


async def unsave_recipe(user_id: str, recipe_id: str, db: AsyncSession) -> None:
    """사용자 저장 목록에서 레시피를 제거한다. 저장 내역이 없으면 에러."""
    result = await db.execute(
        delete(RecipeSave).where(
            RecipeSave.user_id == user_id,
            RecipeSave.recipe_id == recipe_id,
        )
    )
    if result.rowcount == 0:
        raise RecipeSaveError(404, "저장된 레시피를 찾을 수 없습니다.")

    await db.commit()


async def get_recipe(recipe_id: str, db: AsyncSession) -> Recipe:
    """레시피 ID로 재료·단계·영상을 포함한 레시피를 조회한다. 없으면 에러."""
    result = await db.execute(
        select(Recipe)
        .options(
            # 상세 화면에서 필요한 하위 목록을 async lazy loading 없이 한 번에 준비한다.
            selectinload(Recipe.ingredients),
            selectinload(Recipe.steps),
            selectinload(Recipe.videos),
        )
        .where(Recipe.recipe_id == recipe_id)
    )
    recipe = result.scalar_one_or_none()
    if not recipe:
        raise RecipeSaveError(404, "레시피를 찾을 수 없습니다.")
    return recipe
