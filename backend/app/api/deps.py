from fastapi import HTTPException, Request, status


def get_current_user_id(request: Request) -> str:
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="로그인이 필요합니다.",
        )
    return user_id


def get_optional_user_id(request: Request) -> str | None:
    return request.session.get("user_id")
