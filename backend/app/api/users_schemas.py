from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class UsersBaseModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class UserProfileResponse(UsersBaseModel):
    user_id: str = Field(..., alias="userId", description="사용자 ID")
    email: str = Field(..., description="사용자 이메일")
    nickname: str = Field(..., description="사용자 닉네임")
    created_at: datetime = Field(..., alias="createdAt", description="가입 일시")


class UserProfileUpdateRequest(UsersBaseModel):
    nickname: str | None = Field(
        None, min_length=1, max_length=15, description="변경할 사용자 닉네임"
    )


class UserIngredientItem(UsersBaseModel):
    name: str = Field(..., description="재료 이름")


class UserIngredientsResponse(UsersBaseModel):
    ingredients: list[UserIngredientItem] = Field(..., description="내 재료 목록")


class UserIngredientsUpdateRequest(UsersBaseModel):
    """내 재료 전체 교체 요청 DTO."""

    ingredients: list[str] = Field(..., description="최종 저장할 내 재료 이름 목록")

    @field_validator("ingredients")
    @classmethod
    def normalize_ingredients(cls, ingredients: list[str]) -> list[str]:
        """공백 재료를 거부하고 중복 입력은 최초 한 번만 유지한다."""
        normalized: list[str] = []
        seen: set[str] = set()

        for ingredient in ingredients:
            name = ingredient.strip()
            if not name:
                raise ValueError("Ingredient name must not be blank")
            if name not in seen:
                normalized.append(name)
                seen.add(name)

        return normalized


class SavedRecipeItem(UsersBaseModel):
    recipe_id: str = Field(..., alias="recipeId", description="레시피 ID")
    name: str = Field(..., description="레시피 이름")
    description: str | None = Field(None, description="레시피 설명")
    category: str | None = Field(None, description="레시피 카테고리")
    cook_time: int | None = Field(None, alias="cookTime", description="조리 시간")
    difficulty: str | None = Field(None, description="난이도")
    servings: int | None = Field(None, description="인분")
    image_url: str | None = Field(None, alias="imageUrl", description="레시피 대표 이미지 URL")
    saved_at: datetime = Field(..., alias="savedAt", description="저장 일시")


class SavedRecipesResponse(UsersBaseModel):
    recipes: list[SavedRecipeItem] = Field(..., description="저장한 레시피 목록")


class MyPostItem(UsersBaseModel):
    post_id: str = Field(..., alias="postId", description="게시글 ID")
    title: str = Field(..., description="게시글 제목")
    description: str | None = Field(None, description="게시글 설명")
    cook_time: int | None = Field(None, alias="cookTime", description="조리 시간")
    category: str | None = Field(None, description="카테고리")
    difficulty: str | None = Field(None, description="난이도")
    like_count: int = Field(..., alias="likeCount", description="좋아요 수")
    created_at: datetime = Field(..., alias="createdAt", description="게시글 작성 일시")
    updated_at: datetime = Field(..., alias="updatedAt", description="게시글 수정 일시")
    source_recipe_id: str | None = Field(
        None, alias="sourceRecipeId", description="원본 레시피 ID"
    )
    source_recipe_image_url: str | None = Field(
        None, alias="sourceRecipeImageUrl", description="원본 레시피 대표 이미지 URL"
    )


class MyPostsResponse(UsersBaseModel):
    posts: list[MyPostItem] = Field(..., description="내가 작성한 게시글 목록")


class LikedPostItem(UsersBaseModel):
    post_id: str = Field(..., alias="postId", description="게시글 ID")
    title: str = Field(..., description="게시글 제목")
    description: str | None = Field(None, description="게시글 설명")
    cook_time: int | None = Field(None, alias="cookTime", description="조리 시간")
    category: str | None = Field(None, description="카테고리")
    difficulty: str | None = Field(None, description="난이도")
    like_count: int = Field(..., alias="likeCount", description="좋아요 수")
    author_nickname: str = Field(..., alias="authorNickname", description="작성자 닉네임")
    created_at: datetime = Field(..., alias="createdAt", description="게시글 작성 일시")
    liked_at: datetime = Field(..., alias="likedAt", description="좋아요 누른 일시")
    source_recipe_image_url: str | None = Field(
        None, alias="sourceRecipeImageUrl", description="원본 레시피 대표 이미지 URL"
    )


class LikedPostsResponse(UsersBaseModel):
    posts: list[LikedPostItem] = Field(..., description="좋아요한 게시글 목록")
