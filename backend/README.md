# 뭐해먹냉 Backend

뭐해먹냉의 백엔드 애플리케이션입니다.

## 주요 API 범위

- `auth`: 회원가입, 로그인, 로그아웃
- `users`: 내 정보, 내 재료, 저장 레시피, 작성 글, 좋아요한 글
- `ingredients`: 재료 자동완성
- `recipe`: AI 레시피 추천, 대표 이미지 검색
- `recipes`: 레시피 상세 조회, 저장, 저장 취소
- `posts`: 레시피 공유 피드, 댓글, 좋아요

## 기술 스택

- FastAPI
- SQLAlchemy Async
- Alembic
- MySQL
- LangChain Google GenAI
- YouTube Data API
- Naver Image Search API

## 사전 준비 사항

- Python 3.11 이상
- MySQL 서버
- Gemini API 키
- YouTube Data API 키
- Naver Search API 키

## 환경변수

`backend/.env` 파일을 생성하고 필요한 값을 설정합니다.

```env
DATABASE_URL=mysql+asyncmy://user:password@localhost:3306/meoknaeng
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
GEMINI_TEMPERATURE=0.7
YOUTUBE_API_KEY=your-youtube-api-key
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
RECIPE_COUNT=5
SESSION_SECRET_KEY=replace-with-random-secret
ALLOWED_ORIGINS=http://localhost:5173
ALLOWED_ORIGIN_REGEX=https://meoknaeng-[^.]*-suhan-has-projects\.vercel\.app
HTTPS_ONLY=false
```

환경변수 설명:

- `DATABASE_URL`: MySQL 데이터베이스 연결 문자열
- `GEMINI_API_KEY`: Gemini API 키
- `GEMINI_MODEL`: 레시피 추천에 사용할 Gemini 모델
- `GEMINI_TEMPERATURE`: 추천 응답 다양성 설정
- `YOUTUBE_API_KEY`: 관련 영상 검색용 YouTube Data API 키
- `NAVER_CLIENT_ID`: 레시피 대표 이미지 검색용 Naver 애플리케이션 Client ID
- `NAVER_CLIENT_SECRET`: 레시피 대표 이미지 검색용 Naver 애플리케이션 Client Secret
- `RECIPE_COUNT`: 한 번에 추천할 레시피 개수
- `SESSION_SECRET_KEY`: 세션 쿠키 서명 키
- `ALLOWED_ORIGINS`: CORS 허용 origin 목록
- `ALLOWED_ORIGIN_REGEX`: CORS 허용 origin 정규식
- `HTTPS_ONLY`: HTTPS 환경에서 세션 쿠키 보안 옵션 사용 여부

## 실행 방법

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Windows PowerShell:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

API 서버는 기본적으로 http://localhost:8000 에서 실행됩니다.

## API 문서와 상태 확인

- API 문서: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## DB 마이그레이션

DB 스키마는 Alembic으로 관리합니다.

```bash
alembic upgrade head
```

새 마이그레이션이 필요한 경우에는 모델 변경 후 Alembic revision을 생성하고, 생성된 파일을 검토한 뒤 커밋합니다.

```bash
alembic revision --autogenerate -m "change description"
```

## 디렉토리 구조

```text
backend/
├── alembic/        # DB migration
├── app/
│   ├── api/        # API router와 request/response schema
│   ├── chain/      # LLM chain
│   ├── models/     # SQLAlchemy model과 공통 schema
│   ├── prompts/    # LLM prompt
│   ├── service/    # 비즈니스 로직
│   ├── config.py   # 환경변수 설정
│   ├── db.py       # DB 연결
│   └── main.py     # FastAPI app entrypoint
├── requirements.txt
└── alembic.ini
```
