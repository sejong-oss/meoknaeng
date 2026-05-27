from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.recipe import Recipe
from app.models.schemas import ApiResponse, RecipeRequest, RecipeResponse, YouTubeVideosResponse
from app.service.recipe import RecipeServiceError, recommend_recipe
from app.service.youtube import YouTubeServiceError, search_recipe_videos

router = APIRouter(prefix="/recipe", tags=["recipe"])


@router.post("/recommend", response_model=ApiResponse[RecipeResponse])
async def recommend_recipe_handler(
    payload: RecipeRequest,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[RecipeResponse]:
    try:
        data = await recommend_recipe(payload, db)
        return ApiResponse(success=True, data=data)
    except RecipeServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.get("/{recipe_id}/videos", response_model=ApiResponse[YouTubeVideosResponse])
async def get_recipe_videos_handler(
    recipe_id: str,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[YouTubeVideosResponse]:
    result = await db.execute(select(Recipe).where(Recipe.recipe_id == recipe_id))
    recipe = result.scalar_one_or_none()
    if not recipe:
        raise HTTPException(status_code=404, detail="레시피를 찾을 수 없습니다.")

    try:
        data = await search_recipe_videos(recipe.name)
        return ApiResponse(success=True, data=data)
    except YouTubeServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
