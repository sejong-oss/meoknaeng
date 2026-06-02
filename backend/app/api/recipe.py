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
    """보유 재료와 요구사항을 기반으로 AI 추천 레시피 목록을 생성한다."""
    try:
        # 로그인 사용자는 추천 결과와 입력 재료를 DB에 저장하고, 비로그인은 추천 응답만 받는다.
        data = await recommend_recipe(payload, db, user_id=user_id)
    except RecipeServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    return ApiResponse(success=True, data=data)
