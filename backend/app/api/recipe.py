import json

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from app.chain.recipe import recipe_chain
from app.models.schemas import RecipeRequest, RecipeResponse

router = APIRouter(prefix="/recipe", tags=["recipe"])


@router.post("/recommend", response_model=RecipeResponse)
async def recommend_recipe(payload: RecipeRequest) -> RecipeResponse:
    try:
        raw = await recipe_chain.ainvoke(
            {
                "ingredients": ", ".join(payload.ingredients),
                "query": payload.query,
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM call failed: {exc}") from exc

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502, detail=f"LLM returned non-JSON: {exc}"
        ) from exc

    try:
        return RecipeResponse.model_validate(parsed)
    except ValidationError as exc:
        raise HTTPException(
            status_code=502, detail=f"LLM JSON did not match schema: {exc}"
        ) from exc
