import json

from pydantic import ValidationError

from app.chain.recipe import recipe_chain
from app.models.schemas import RecipeRequest, RecipeResponse


class RecipeServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


async def recommend_recipe(payload: RecipeRequest) -> RecipeResponse:
    try:
        raw = await recipe_chain.ainvoke(
            {
                "ingredients": ", ".join(payload.ingredients),
                "query": payload.query,
            }
        )
    except Exception as exc:
        raise RecipeServiceError(502, f"LLM call failed: {exc}") from exc

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RecipeServiceError(502, f"LLM returned non-JSON: {exc}") from exc

    try:
        return RecipeResponse.model_validate(parsed)
    except ValidationError as exc:
        raise RecipeServiceError(502, f"LLM JSON did not match schema: {exc}") from exc
