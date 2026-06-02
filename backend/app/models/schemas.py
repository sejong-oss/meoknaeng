from enum import Enum
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """성공 응답을 감싸는 공통 포맷. 실제 payload는 data에 담긴다."""

    success: bool = True
    data: T
    message: str | None = None


class ErrorResponse(BaseModel):
    """전역 예외 핸들러가 사용하는 실패 응답 포맷."""

    success: bool = False
    data: None = None
    message: str


class ApiBaseModel(BaseModel):
    """내부 필드는 snake_case로 유지하고 외부 JSON 응답은 camelCase로 직렬화한다."""

    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel,
    )


class Difficulty(str, Enum):
    EASY = "쉬움"
    MEDIUM = "중간"
    HARD = "어려움"


class Category(str, Enum):
    KOREAN = "한식"
    CHINESE = "중식"
    JAPANESE = "일식"
    WESTERN = "양식"


class YouTubeVideoItem(ApiBaseModel):
    video_id: str = Field(..., description="YouTube 영상 ID")
    title: str = Field(..., description="영상 제목")
    thumbnail_url: str = Field(..., description="썸네일 이미지 URL")
    video_url: str = Field(..., description="YouTube 영상 링크")


class YouTubeVideosResponse(ApiBaseModel):
    videos: list[YouTubeVideoItem] = Field(..., description="관련 YouTube 영상 목록")


class RecipeIngredient(ApiBaseModel):
    name: str = Field(..., description="재료 이름")
    amount: str | None = Field(None, description="분량 표기 (예: '200g', '1큰술'). 모르면 null")


class RecipeStep(ApiBaseModel):
    order: int = Field(..., ge=1, description="단계 번호 (1부터 시작)")
    description: str = Field(..., description="해당 단계 조리 설명")


class Recipe(ApiBaseModel):
    recipe_id: str | None = Field(None, description="저장된 레시피 ID")
    name: str = Field(..., description="요리 이름")
    summary: str = Field(..., description="요리 한줄 설명")
    category: Category = Field(..., description="카테고리")
    cook_time_minutes: int = Field(..., ge=1, description="조리 시간(분)")
    difficulty: Difficulty = Field(..., description="난이도")
    servings: int = Field(..., ge=1, description="인분")
    ingredients: list[RecipeIngredient] = Field(..., description="재료 목록")
    steps: list[RecipeStep] = Field(..., description="조리 절차")
    image_url: str | None = Field(None, description="레시피 대표 이미지 URL")


class RecipeRequest(BaseModel):
    ingredients: list[str] = Field(..., min_length=1, description="보유한 재료 목록")
    query: Optional[str] = Field(None, description="사용자가 원하는 레시피 요구사항 (없으면 재료 기반으로만 추천)")


class RecipeResponse(ApiBaseModel):
    recipes: list[Recipe] = Field(..., description="추천 레시피 목록")


class RecipeDetailIngredient(ApiBaseModel):
    name: str
    amount: str


class RecipeDetailStep(ApiBaseModel):
    order: int
    description: str | None


class RecipeDetail(ApiBaseModel):
    recipe_id: str
    name: str
    description: str | None
    category: str | None
    cook_time: int | None
    difficulty: str | None
    servings: int | None
    ingredients: list[RecipeDetailIngredient]
    steps: list[RecipeDetailStep]
    image_url: str | None = None
    videos: list[YouTubeVideoItem] = Field(default_factory=list)


class PostCreateRequest(BaseModel):
    title: str = Field(..., max_length=200)
    description: str | None = None
    tip: str | None = Field(None, max_length=200)
    cook_time: int | None = None
    category: str | None = None
    difficulty: str | None = None
    source_recipe_id: str | None = None


class PostUpdateRequest(BaseModel):
    title: str | None = Field(None, max_length=200)
    description: str | None = None
    tip: str | None = Field(None, max_length=200)
    cook_time: int | None = None
    category: str | None = None
    difficulty: str | None = None


class PostResponse(ApiBaseModel):
    post_id: str
    author_id: str
    title: str
    description: str | None
    tip: str | None
    cook_time: int | None
    category: str | None
    difficulty: str | None
    source_recipe_id: str | None
    created_at: str
    updated_at: str


class RecipeSummary(ApiBaseModel):
    recipe_id: str
    name: str
    description: str | None
    cook_time: int | None
    difficulty: str | None
    servings: int | None


class PostListItem(ApiBaseModel):
    post_id: str
    title: str
    cook_time: int | None
    category: str | None
    difficulty: str | None
    author_nickname: str
    like_count: int
    created_at: str
    source_recipe_image_url: str | None = None


class PostListResponse(ApiBaseModel):
    posts: list[PostListItem]
    total: int
    page: int
    size: int


class PostDetailResponse(ApiBaseModel):
    post_id: str
    author_id: str
    author_nickname: str
    title: str
    description: str | None
    tip: str | None
    like_count: int
    created_at: str
    updated_at: str
    source_recipe: RecipeDetail | None


class CommentCreateRequest(BaseModel):
    content: str = Field(..., min_length=1)


class CommentUpdateRequest(BaseModel):
    content: str = Field(..., min_length=1)


class CommentResponse(ApiBaseModel):
    comment_id: str
    post_id: str
    author_id: str
    author_nickname: str
    content: str
    created_at: str


class CommentListResponse(ApiBaseModel):
    comments: list[CommentResponse]
