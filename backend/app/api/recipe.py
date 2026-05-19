from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.schemas import ApiResponse, RecipeRequest, RecipeResponse
from app.service.recipe import RecipeServiceError, recommend_recipe

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
