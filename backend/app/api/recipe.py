from fastapi import APIRouter, HTTPException

from app.models.schemas import RecipeRequest, RecipeResponse
from app.service.recipe import RecipeServiceError, recommend_recipe

router = APIRouter(prefix="/recipe", tags=["recipe"])


@router.post("/recommend", response_model=RecipeResponse)
async def recommend_recipe_handler(payload: RecipeRequest) -> RecipeResponse:
    try:
        return await recommend_recipe(payload)
    except RecipeServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
