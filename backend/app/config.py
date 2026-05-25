import os

from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
GEMINI_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", "0.7"))

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

RECIPE_COUNT = int(os.getenv("RECIPE_COUNT", "3"))

DATABASE_URL = os.getenv("DATABASE_URL", "")

SESSION_SECRET_KEY = os.getenv(
    "SESSION_SECRET_KEY", "placeholder-session-secret-key"
)

HTTPS_ONLY = os.getenv("HTTPS_ONLY", "false").lower() == "true"

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
ALLOWED_ORIGINS: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# Vercel 프리뷰 URL 패턴: meoknaeng-*-suhan-has-projects.vercel.app
ALLOWED_ORIGIN_REGEX: str = os.getenv(
    "ALLOWED_ORIGIN_REGEX",
    r"https://meoknaeng-[^.]*-suhan-has-projects\.vercel\.app",
)
