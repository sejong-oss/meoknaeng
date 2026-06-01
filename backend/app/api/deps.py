from fastapi import HTTPException, Request, status


def get_current_user_id(request: Request) -> str:
    """세션에서 로그인된 user_id를 반환한다. 미로그인 시 401 에러."""
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="로그인이 필요합니다.",
        )
    return user_id


def get_optional_user_id(request: Request) -> str | None:
    """세션에서 user_id를 반환한다. 미로그인이면 None을 반환한다."""
    return request.session.get("user_id")
