from fastapi import HTTPException, Request, status


def get_current_user_id(request: Request) -> str:
    """인증이 필요한 라우터에서 세션 기반 로그인 여부를 확인한다."""
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="로그인이 필요합니다.",
        )
    return user_id


def get_optional_user_id(request: Request) -> str | None:
    """로그인 여부가 선택 사항인 라우터에서 세션 user_id만 조용히 꺼낸다."""
    return request.session.get("user_id")
