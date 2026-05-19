from fastapi import APIRouter, HTTPException

from app.models.schemas import ApiResponse, RecipeRequest, RecipeResponse
from app.service.recipe import RecipeServiceError, recommend_recipe

router = APIRouter(prefix="/recipe", tags=["recipe"])


@router.post("/recommend", response_model=ApiResponse[RecipeResponse])
async def recommend_recipe_handler(payload: RecipeRequest) -> ApiResponse[RecipeResponse]:
    try:
        data = await recommend_recipe(payload)
        return ApiResponse(success=True, data=data)
    except RecipeServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
