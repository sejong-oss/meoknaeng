import json
import uuid
from datetime import datetime, timezone

from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.chain.recipe import recipe_chain
from app.models.recipe import Recipe as RecipeORM
from app.models.recipe import RecipeIngredient as RecipeIngredientORM
from app.models.recipe import RecipeStep as RecipeStepORM
from app.models.schemas import RecipeRequest, RecipeResponse
from app.models.user import UserIngredient
from app.service.image_search import fetch_recipe_image


class RecipeServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


async def recommend_recipe(payload: RecipeRequest, db: AsyncSession, *, user_id: str | None = None) -> RecipeResponse:
    try:
        raw = await recipe_chain.ainvoke(
            {
                "ingredients": ", ".join(payload.ingredients),
                "query": payload.query or "특별한 요구사항 없음. 보유 재료로 만들 수 있는 최선의 레시피를 추천해주세요.",
            }
        )
    except Exception as exc:
        raise RecipeServiceError(502, "레시피 생성에 실패했습니다.") from exc

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RecipeServiceError(502, "레시피 생성에 실패했습니다.") from exc

    try:
        response = RecipeResponse.model_validate(parsed)
    except ValidationError as exc:
        raise RecipeServiceError(502, "레시피 생성에 실패했습니다.") from exc

    now = datetime.now(timezone.utc)
    for recipe in response.recipes:
        image_url = await fetch_recipe_image(recipe.name)
        orm_recipe = RecipeORM(
            recipe_id=str(uuid.uuid4()),
            name=recipe.name,
            description=recipe.summary,
            category=recipe.category.value,
            cook_time=recipe.cook_time_minutes,
            difficulty=recipe.difficulty.value,
            servings=recipe.servings,
            image_url=image_url,
            created_at=now,
        )
        db.add(orm_recipe)

        for ing in recipe.ingredients:
            db.add(RecipeIngredientORM(
                recipe_id=orm_recipe.recipe_id,
                name=ing.name,
                amount=ing.amount or "적당량",
            ))

        for step in recipe.steps:
            db.add(RecipeStepORM(
                recipe_id=orm_recipe.recipe_id,
                step_order=step.order,
                description=step.description,
            ))

        recipe.recipe_id = orm_recipe.recipe_id
        recipe.image_url = image_url

    if user_id:
        existing = set(
            (await db.scalars(
                select(UserIngredient.ingredient_name).where(UserIngredient.user_id == user_id)
            )).all()
        )
        new_names = [name for name in payload.ingredients if name not in existing]
        if new_names:
            for name in new_names:
                db.add(UserIngredient(user_id=user_id, ingredient_name=name, created_at=now))

    await db.commit()
    return response
