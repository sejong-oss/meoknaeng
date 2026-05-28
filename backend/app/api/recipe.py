from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_optional_user_id
from app.db import get_db
from app.models.schemas import ApiResponse, RecipeRequest, RecipeResponse
from app.service.recipe import RecipeServiceError, recommend_recipe

router = APIRouter(prefix="/recipe", tags=["recipe"])


@router.post("/recommend", response_model=ApiResponse[RecipeResponse])
async def recommend_recipe_handler(
    payload: RecipeRequest,
    user_id: str | None = Depends(get_optional_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[RecipeResponse]:
    try:
        data = await recommend_recipe(payload, db, user_id=user_id)
    except RecipeServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    return ApiResponse(success=True, data=data)
