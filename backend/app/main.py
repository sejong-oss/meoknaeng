from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.api.auth import router as auth_router
from app.api.ingredients import router as ingredients_router
from app.api.recipe import router as recipe_router
from app.api.recipe_save import router as recipe_save_router
from app.config import ALLOWED_ORIGINS, SESSION_SECRET_KEY

app = FastAPI(title="Recipe Recommender API")

app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(ingredients_router)
app.include_router(recipe_router)
app.include_router(recipe_save_router)


@app.get("/")
def read_root():
    return {"message": "Recipe Recommender API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
