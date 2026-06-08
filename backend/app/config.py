import os

from dotenv import load_dotenv

load_dotenv()

# 외부 API와 배포 환경별 설정값은 모두 환경변수에서 읽어온다.
# 값이 비어 있으면 해당 부가 기능은 service 계층에서 안전하게 비활성화된다.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", "0.7"))

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID", "")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET", "")

RECIPE_COUNT = int(os.getenv("RECIPE_COUNT", "5"))

DATABASE_URL = os.getenv("DATABASE_URL", "")

SESSION_SECRET_KEY = os.getenv(
    "SESSION_SECRET_KEY", "placeholder-session-secret-key"
)

HTTPS_ONLY = os.getenv("HTTPS_ONLY", "false").lower() == "true"

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
ALLOWED_ORIGINS: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# Vercel 프리뷰 URL은 브랜치마다 주소가 바뀌므로 정규식으로 CORS를 허용한다.
ALLOWED_ORIGIN_REGEX: str = os.getenv(
    "ALLOWED_ORIGIN_REGEX",
    r"https://meoknaeng-[^.]*-suhan-has-projects\.vercel\.app",
)
