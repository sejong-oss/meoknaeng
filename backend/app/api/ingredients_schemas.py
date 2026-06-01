from pydantic import BaseModel, ConfigDict, Field


class IngredientsBaseModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class IngredientAutocompleteItem(IngredientsBaseModel):
    id: str = Field(..., description="재료 ID")
    name: str = Field(..., description="재료 이름")


class IngredientAutocompleteResponse(IngredientsBaseModel):
    query: str = Field(..., description="검색 키워드")
    limit: int = Field(..., description="반환 제한 개수")
    items: list[IngredientAutocompleteItem] = Field(
        ..., description="자동완성 재료 후보 목록"
    )
