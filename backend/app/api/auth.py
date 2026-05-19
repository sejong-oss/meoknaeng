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
    existing_user = await db.scalar(
        select(User).where(
            or_(User.email == payload.email, User.nickname == payload.nickname)
        )
    )
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or nickname already exists",
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
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or nickname already exists",
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
    user = await db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

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
    if "user_id" not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    request.session.clear()

    return ApiResponse(success=True, data=None)
