from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth_schemas import (
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse,
)
from app.db import get_db
from app.models.schemas import ApiResponse
from app.models.user import User
from app.service.auth import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


def _utc_now() -> datetime:
    """DB TIMESTAMP 컬럼에 저장할 naive UTC 시간을 생성한다."""
    return datetime.now(UTC).replace(tzinfo=None)


@router.post(
    "/signup",
    response_model=ApiResponse[SignupResponse],
    status_code=status.HTTP_201_CREATED,
    summary="회원가입",
)
async def signup(
    payload: SignupRequest,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[SignupResponse]:
    """사용자 계정을 생성하고 비밀번호는 해시된 값만 저장한다."""
    existing_user = await db.scalar(
        select(User).where(
            or_(User.email == payload.email, User.nickname == payload.nickname)
        )
    )
    if existing_user is not None:
        # 중복 여부를 사전에 확인해 사용자에게 명확한 409 응답을 반환한다.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 사용 중인 이메일 또는 닉네임입니다.",
        )

    user = User(
        email=payload.email,
        password=hash_password(payload.password),
        nickname=payload.nickname,
        created_at=_utc_now(),
    )
    db.add(user)

    try:
        await db.commit()
    except IntegrityError as exc:
        # 동시 회원가입 요청으로 unique 제약이 뒤늦게 충돌하는 경우도 같은 응답으로 처리한다.
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 사용 중인 이메일 또는 닉네임입니다.",
        ) from exc

    await db.refresh(user)

    return ApiResponse(
        success=True,
        data=SignupResponse(user_id=user.user_id, nickname=user.nickname),
    )


@router.post(
    "/login",
    response_model=ApiResponse[LoginResponse],
    summary="로그인 및 세션 생성",
)
async def login(
    payload: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[LoginResponse]:
    """email/password 검증 후 서버 세션에 로그인 사용자 정보를 저장한다."""
    user = await db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
        )

    # 이후 인증 의존성은 이 세션 값을 기준으로 현재 사용자를 식별한다.
    request.session["user_id"] = user.user_id
    request.session["nickname"] = user.nickname

    return ApiResponse(
        success=True,
        data=LoginResponse(
            user_id=user.user_id,
            nickname=user.nickname,
            session_active=True,
        ),
    )


@router.delete(
    "/logout",
    response_model=ApiResponse[None],
    summary="로그아웃",
)
async def logout(request: Request) -> ApiResponse[None]:
    """현재 요청의 세션을 비워 서버 기준 로그인 상태를 종료한다."""
    if "user_id" not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="로그인이 필요합니다.",
        )

    request.session.clear()

    return ApiResponse(success=True, data=None)
