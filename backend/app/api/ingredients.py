from fastapi import APIRouter, Query

from app.api.ingredients_schemas import (
    IngredientAutocompleteItem,
    IngredientAutocompleteResponse,
)
from app.models.schemas import ApiResponse

router = APIRouter(prefix="/ingredients", tags=["ingredients"])

_INGREDIENT_SEEDS = [
    {"id": "ingredient-onion", "name": "양파"},
    {"id": "ingredient-green-onion", "name": "대파"},
    {"id": "ingredient-garlic", "name": "마늘"},
    {"id": "ingredient-carrot", "name": "당근"},
    {"id": "ingredient-potato", "name": "감자"},
    {"id": "ingredient-egg", "name": "계란"},
    {"id": "ingredient-tofu", "name": "두부"},
    {"id": "ingredient-kimchi", "name": "김치"},
    {"id": "ingredient-pork", "name": "돼지고기"},
    {"id": "ingredient-chicken", "name": "닭고기"},
    {"id": "ingredient-beef", "name": "소고기"},
    {"id": "ingredient-rice", "name": "밥"},
    {"id": "ingredient-ramen", "name": "라면"},
    {"id": "ingredient-tomato", "name": "토마토"},
    {"id": "ingredient-mushroom", "name": "버섯"},
]


@router.get(
    "/autocomplete",
    response_model=ApiResponse[IngredientAutocompleteResponse],
    summary="재료 자동완성",
)
async def autocomplete_ingredients(
    q: str = Query("", description="검색 키워드"),
    limit: int = Query(10, ge=1, le=20, description="반환 제한 개수"),
) -> ApiResponse[IngredientAutocompleteResponse]:
    query = q.strip()
    if not query:
        return ApiResponse(
            success=True,
            data=IngredientAutocompleteResponse(query=query, limit=limit, items=[]),
        )

    normalized_query = query.casefold()
    matched_items = [
        IngredientAutocompleteItem(**ingredient)
        for ingredient in _INGREDIENT_SEEDS
        if normalized_query in ingredient["name"].casefold()
    ][:limit]

    return ApiResponse(
        success=True,
        data=IngredientAutocompleteResponse(
            query=query,
            limit=limit,
            items=matched_items,
        ),
    )
