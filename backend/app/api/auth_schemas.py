import re
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
NICKNAME_MAX_LENGTH = 50


class AuthBaseModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class SignupRequest(AuthBaseModel):
    email: str = Field(..., description="사용자 이메일")
    password: str = Field(..., description="사용자 비밀번호")
    nickname: str = Field("", description="사용자 닉네임")

    @field_validator("email")
    @classmethod
    def validate_email(cls, email: str) -> str:
        email = email.strip()
        if not EMAIL_PATTERN.match(email):
            raise ValueError("올바른 이메일 형식이 아닙니다.")
        return email

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str) -> str:
        if len(password) < 8:
            raise ValueError("비밀번호는 8자 이상이어야 합니다.")
        return password

    @field_validator("nickname")
    @classmethod
    def validate_nickname(cls, nickname: str) -> str:
        nickname = nickname.strip()
        if not nickname:
            raise ValueError("닉네임을 입력해주세요.")
        if len(nickname) > NICKNAME_MAX_LENGTH:
            raise ValueError(f"닉네임은 {NICKNAME_MAX_LENGTH}자 이하여야 합니다.")
        return nickname

    @model_validator(mode="before")
    @classmethod
    def set_missing_nickname(cls, data: Any) -> Any:
        if isinstance(data, dict) and "nickname" not in data:
            return {**data, "nickname": ""}
        return data


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
