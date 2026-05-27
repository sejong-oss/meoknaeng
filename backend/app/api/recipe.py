from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.recipe import Recipe
from app.models.schemas import ApiResponse, RecipeRequest, RecipeResponse, YouTubeVideosResponse
from app.service.recipe import RecipeServiceError, recommend_recipe
from app.service.youtube import YouTubeServiceError, fetch_and_save_videos_bulk, get_recipe_videos

router = APIRouter(prefix="/recipe", tags=["recipe"])


@router.post("/recommend", response_model=ApiResponse[RecipeResponse])
async def recommend_recipe_handler(
    payload: RecipeRequest,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[RecipeResponse]:
    try:
        data = await recommend_recipe(payload, db)
    except RecipeServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    # 레시피 이름이 확정된 후 YouTube 영상 3개 동시 검색 + 일괄 저장
    video_map = await fetch_and_save_videos_bulk(
        [(r.recipe_id, r.name) for r in data.recipes],
        db,
    )

    for recipe in data.recipes:
        recipe.videos = video_map[recipe.recipe_id].videos

    return ApiResponse(success=True, data=data)


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
        data = await get_recipe_videos(recipe_id, recipe.name, db)
        return ApiResponse(success=True, data=data)
    except YouTubeServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
