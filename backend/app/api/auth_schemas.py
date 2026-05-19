from pydantic import BaseModel, ConfigDict, Field


class AuthBaseModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class SignupRequest(AuthBaseModel):
    email: str = Field(..., description="사용자 이메일")
    password: str = Field(..., min_length=8, description="사용자 비밀번호")
    nickname: str = Field(..., min_length=1, description="사용자 닉네임")


class SignupResponse(AuthBaseModel):
    user_id: str = Field(..., alias="userId", description="생성된 사용자 ID")
    nickname: str = Field(..., description="사용자 닉네임")


class LoginRequest(AuthBaseModel):
    email: str = Field(..., description="사용자 이메일")
    password: str = Field(..., min_length=1, description="사용자 비밀번호")


class LoginResponse(AuthBaseModel):
    user_id: str = Field(..., alias="userId", description="로그인한 사용자 ID")
    nickname: str = Field(..., description="사용자 닉네임")
    session_active: bool = Field(
        ..., alias="sessionActive", description="세션 활성화 여부"
    )
