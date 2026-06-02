from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.db import get_db
from app.models.schemas import ApiResponse, RecipeDetail, RecipeDetailIngredient, RecipeDetailStep, YouTubeVideoItem
from app.service.recipe_save import RecipeSaveError, get_recipe, save_recipe, unsave_recipe
from app.service.youtube import YouTubeServiceError, get_recipe_videos

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.post("/{recipe_id}", response_model=ApiResponse[None], status_code=status.HTTP_201_CREATED)
async def save_recipe_handler(
    recipe_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
    """로그인 사용자의 레시피 저장 요청을 처리한다."""
    try:
        await save_recipe(user_id, recipe_id, db)
        return ApiResponse(success=True, data=None)
    except RecipeSaveError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.delete("/{recipe_id}", response_model=ApiResponse[None])
async def unsave_recipe_handler(
    recipe_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[None]:
    """로그인 사용자의 레시피 저장 취소 요청을 처리한다."""
    try:
        await unsave_recipe(user_id, recipe_id, db)
        return ApiResponse(success=True, data=None)
    except RecipeSaveError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.get("/{recipe_id}", response_model=ApiResponse[RecipeDetail])
async def get_recipe_handler(
    recipe_id: str,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[RecipeDetail]:
    """저장된 레시피 상세와 관련 YouTube 영상을 함께 반환한다."""
    try:
        recipe = await get_recipe(recipe_id, db)
    except RecipeSaveError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    try:
        videos_response = await get_recipe_videos(recipe_id, recipe.name, db)
        videos = [
            YouTubeVideoItem(
                video_id=v.video_id,
                title=v.title,
                thumbnail_url=v.thumbnail_url,
                video_url=v.video_url,
            )
            for v in videos_response.videos
        ]
    except YouTubeServiceError:
        # 영상 API는 보조 정보라 실패해도 레시피 상세 조회 자체는 성공시키고 빈 목록을 내려준다.
        videos = []

    return ApiResponse(
        success=True,
        data=RecipeDetail(
            recipe_id=recipe.recipe_id,
            name=recipe.name,
            description=recipe.description,
            category=recipe.category,
            cook_time=recipe.cook_time,
            difficulty=recipe.difficulty,
            servings=recipe.servings,
            image_url=recipe.image_url,
            ingredients=[
                RecipeDetailIngredient(name=i.name, amount=i.amount)
                for i in recipe.ingredients
            ],
            steps=sorted(
                [RecipeDetailStep(order=s.step_order, description=s.description) for s in recipe.steps],
                key=lambda s: s.order,
            ),
            videos=videos,
        ),
    )
