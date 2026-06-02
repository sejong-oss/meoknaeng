import asyncio
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
    """레시피 추천 관련 서비스 에러. status_code와 메시지를 포함한다."""

    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


async def recommend_recipe(payload: RecipeRequest, db: AsyncSession, *, user_id: str | None = None) -> RecipeResponse:
    """Gemini로 레시피를 생성하고 DB에 저장한 뒤 추천 응답을 반환한다.

    AI 응답은 외부 모델 출력이므로 JSON 파싱과 Pydantic 검증을 거친 뒤에만
    DB에 저장한다. 로그인 사용자가 보낸 재료는 이후 재사용할 수 있도록
    내 재료 목록에도 자동 추가한다.
    """
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
    # 대표 이미지 조회는 부가 정보라서 레시피 개수만큼 병렬 요청해 응답 지연을 줄인다.
    image_urls = await asyncio.gather(
        *[fetch_recipe_image(recipe.name) for recipe in response.recipes]
    )
    for recipe, image_url in zip(response.recipes, image_urls):
        # 프론트가 추천 직후 상세/저장을 요청할 수 있도록 추천 결과를 즉시 DB에 영속화한다.
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
        # 추천에 사용한 새 재료만 내 재료에 추가해 중복 저장을 방지한다.
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
