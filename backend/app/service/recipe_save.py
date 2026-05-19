from datetime import datetime, timezone

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.recipe import Recipe, RecipeSave


class RecipeSaveError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


async def save_recipe(user_id: str, recipe_id: str, db: AsyncSession) -> None:
    recipe = await db.get(Recipe, recipe_id)
    if not recipe:
        raise RecipeSaveError(404, "Recipe not found")

    existing = await db.execute(
        select(RecipeSave).where(
            RecipeSave.user_id == user_id,
            RecipeSave.recipe_id == recipe_id,
        )
    )
    if existing.scalar_one_or_none():
        raise RecipeSaveError(409, "Recipe already saved")

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
        raise RecipeSaveError(404, "Saved recipe not found")

    await db.commit()
