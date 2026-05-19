from enum import Enum
from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: T


class Difficulty(str, Enum):
    EASY = "쉬움"
    MEDIUM = "중간"
    HARD = "어려움"


class RecipeIngredient(BaseModel):
    name: str = Field(..., description="재료 이름")
    amount: str | None = Field(None, description="분량 표기 (예: '200g', '1큰술'). 모르면 null")


class RecipeStep(BaseModel):
    order: int = Field(..., ge=1, description="단계 번호 (1부터 시작)")
    description: str = Field(..., description="해당 단계 조리 설명")


class Recipe(BaseModel):
    recipe_id: str | None = Field(None, description="저장된 레시피 ID")
    name: str = Field(..., description="요리 이름")
    summary: str = Field(..., description="요리 한줄 설명")
    cook_time_minutes: int = Field(..., ge=1, description="조리 시간(분)")
    difficulty: Difficulty = Field(..., description="난이도")
    servings: int = Field(..., ge=1, description="인분")
    ingredients: list[RecipeIngredient] = Field(..., description="재료 목록")
    steps: list[RecipeStep] = Field(..., description="조리 절차")


class RecipeRequest(BaseModel):
    ingredients: list[str] = Field(..., min_length=1, description="보유한 재료 목록")
    query: str = Field(..., min_length=1, description="사용자가 원하는 레시피 요구사항")


class RecipeResponse(BaseModel):
    recipes: list[Recipe] = Field(..., description="추천 레시피 목록")
