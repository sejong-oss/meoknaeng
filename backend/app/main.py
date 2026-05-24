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
from app.config import ALLOWED_ORIGINS, HTTPS_ONLY, SESSION_SECRET_KEY
from app.models.schemas import ErrorResponse

app = FastAPI(title="Recipe Recommender API")

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET_KEY,
    same_site="none" if HTTPS_ONLY else "lax",
    https_only=HTTPS_ONLY,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(message=message).model_dump(),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    message = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return _error_response(status_code=exc.status_code, message=message)


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    return _error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        message="Validation error",
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    return _error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        message="Internal Server Error",
    )


@app.get("/")
def read_root():
    return {"message": "Recipe Recommender API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
