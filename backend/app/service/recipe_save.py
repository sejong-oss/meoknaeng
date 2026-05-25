from datetime import datetime, timezone

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.recipe import Recipe, RecipeIngredient, RecipeStep, RecipeSave


class RecipeSaveError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


async def save_recipe(user_id: str, recipe_id: str, db: AsyncSession) -> None:
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

    db.add(RecipeSave(
        user_id=user_id,
        recipe_id=recipe_id,
        saved_at=datetime.now(timezone.utc),
    ))
    await db.commit()


async def unsave_recipe(user_id: str, recipe_id: str, db: AsyncSession) -> None:
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
    result = await db.execute(
        select(Recipe)
        .options(selectinload(Recipe.ingredients), selectinload(Recipe.steps))
        .where(Recipe.recipe_id == recipe_id)
    )
    recipe = result.scalar_one_or_none()
    if not recipe:
        raise RecipeSaveError(404, "레시피를 찾을 수 없습니다.")
    return recipe
