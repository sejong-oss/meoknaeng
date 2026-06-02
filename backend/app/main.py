from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware

from app.api.auth import router as auth_router
from app.api.ingredients import router as ingredients_router
from app.api.post import router as post_router
from app.api.recipe import router as recipe_router
from app.api.recipe_save import router as recipe_save_router
from app.api.users import router as users_router
from app.config import ALLOWED_ORIGIN_REGEX, ALLOWED_ORIGINS, HTTPS_ONLY, SESSION_SECRET_KEY
from app.models.schemas import ErrorResponse

app = FastAPI(title="Recipe Recommender API")

# 세션 쿠키는 로그인 상태를 서버 세션에 저장하기 위해 사용한다.
# HTTPS 배포에서는 SameSite=None과 secure cookie를 함께 적용한다.
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET_KEY,
    same_site="none" if HTTPS_ONLY else "lax",
    https_only=HTTPS_ONLY,
)
# 프론트엔드가 쿠키 기반 세션을 함께 보낼 수 있도록 credentials를 허용한다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(ingredients_router)
app.include_router(post_router)
app.include_router(recipe_router)
app.include_router(recipe_save_router)
app.include_router(users_router)


def _error_response(status_code: int, message: str) -> JSONResponse:
    """모든 실패 응답을 ErrorResponse 형식으로 감싸서 프론트 처리 방식을 통일한다."""
    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(message=message).model_dump(),
    )


def _validation_error_message(exc: RequestValidationError) -> str:
    """Pydantic validation error에서 프론트에 보여줄 첫 번째 메시지를 추출한다."""
    errors = exc.errors()
    if not errors:
        return "입력값이 올바르지 않습니다."

    message = errors[0].get("msg")
    if isinstance(message, str):
        return message.removeprefix("Value error, ")
    return "입력값이 올바르지 않습니다."


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    """라우터/service에서 발생한 HTTPException을 공통 실패 응답으로 변환한다."""
    message = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return _error_response(status_code=exc.status_code, message=message)


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """요청 스키마 검증 실패도 공통 실패 응답 형식으로 반환한다."""
    return _error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        message=_validation_error_message(exc),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """예상하지 못한 예외가 FastAPI 기본 HTML/JSON 응답으로 노출되지 않도록 막는다."""
    return _error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        message="서버 오류가 발생했습니다.",
    )


@app.get("/")
def read_root():
    return {"message": "Recipe Recommender API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
