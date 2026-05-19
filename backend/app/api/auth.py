from fastapi import APIRouter, HTTPException, Request, status

from app.api.auth_schemas import (
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse,
)
from app.models.schemas import ApiResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="회원가입",
)
async def signup(payload: SignupRequest) -> SignupResponse:
    return SignupResponse(user_id="placeholder-user-id", nickname=payload.nickname)


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="로그인 및 세션 생성",
)
async def login(payload: LoginRequest, request: Request) -> LoginResponse:
    user_id = "placeholder-user-id"
    nickname = "placeholder-nickname"
    request.session["user_id"] = user_id
    request.session["nickname"] = nickname

    return LoginResponse(
        user_id=user_id,
        nickname=nickname,
        session_active=True,
    )


@router.delete(
    "/logout",
    response_model=ApiResponse[None],
    summary="로그아웃",
)
async def logout(request: Request) -> ApiResponse[None]:
    if "user_id" not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    request.session.clear()

    return ApiResponse(success=True, data=None)
