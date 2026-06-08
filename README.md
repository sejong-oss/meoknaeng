# 뭐해먹냉

오늘은 뭐 해먹지?

냉장고 재료 기반 AI 레시피 추천 서비스, 뭐해먹냉의 모노레포입니다.

## 주요 기능

- 재료 입력 및 자동완성
- AI 기반 레시피 추천 및 대표 이미지 제공
- 레시피 상세 조회, 저장, 관련 YouTube 영상 확인
- 레시피 공유 피드 작성, 조회, 댓글, 좋아요
- 마이페이지에서 내 재료, 저장 레시피, 작성 글, 좋아요한 글 관리

## 기술 스택

- Frontend: React, Vite, TailwindCSS, React Router, TanStack React Query, Zustand, motion/react, Carbon Icons, Radix UI, Storybook
- Backend: FastAPI, SQLAlchemy Async, Alembic, MySQL, LangChain Google GenAI, YouTube Data API, Naver Image Search API

## 모노레포 구조

```text
.
├── frontend/       # 프론트엔드 애플리케이션
├── backend/        # FastAPI API 서버
├── .github/        # 이슈/PR 템플릿
├── README.md       # 프로젝트 안내
├── CONTRIBUTING.md # 협업 규칙
└── LICENSE         # MIT License
```

## 문서

- [Frontend](./frontend/README.md)
- [Backend](./backend/README.md)
- [Contributing](./CONTRIBUTING.md)

## 사전 준비 사항

- Node.js 20.19 이상 또는 22.12 이상
- npm
- Python 3.11 이상 권장
- MySQL 서버
- Gemini API 키, YouTube Data API 키, Naver Search API 키

## 환경변수 설정

프론트엔드와 백엔드는 각각 별도의 `.env` 파일을 사용합니다. 로컬 실행 전 샘플 파일을 복사한 뒤 필요한 값을 채웁니다.

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

### Frontend

`frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

- `VITE_API_BASE_URL`: 프론트엔드에서 요청할 백엔드 API 서버 주소입니다.
- 로컬 백엔드를 함께 실행하면 `http://localhost:8000`을 사용합니다.
- 배포 또는 외부 개발 서버를 사용할 때는 해당 API 서버 주소로 변경합니다.

### Backend

`backend/.env`:

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

- `DATABASE_URL`: MySQL 데이터베이스 연결 문자열입니다.
- `GEMINI_API_KEY`: Gemini 레시피 추천에 필요한 API 키입니다.
- `GEMINI_MODEL`: 레시피 추천에 사용할 Gemini 모델입니다.
- `GEMINI_TEMPERATURE`: Gemini 응답 다양성 설정입니다.
- `YOUTUBE_API_KEY`: 관련 YouTube 영상 검색에 필요한 API 키입니다.
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`: 레시피 대표 이미지 검색에 필요한 Naver Search API 인증 정보입니다.
- `RECIPE_COUNT`: 한 번에 추천할 레시피 개수입니다.
- `SESSION_SECRET_KEY`: 세션 쿠키 서명 키입니다. 로컬에서도 임의의 긴 문자열로 교체합니다.
- `ALLOWED_ORIGINS`: CORS를 허용할 프론트엔드 origin입니다. 여러 개는 콤마로 구분합니다.
- `ALLOWED_ORIGIN_REGEX`: Vercel preview처럼 주소가 바뀌는 origin을 허용할 정규식입니다.
- `HTTPS_ONLY`: 로컬에서는 `false`, HTTPS 배포 환경에서는 `true`로 설정합니다.

더 자세한 설명은 [Frontend README](./frontend/README.md)와 [Backend README](./backend/README.md)를 참고합니다.

## 빠른 시작

백엔드의 `backend/.env`, 프론트엔드의 `frontend/.env`를 먼저 설정합니다.

백엔드 실행 예시는 macOS/Linux 기준입니다. Windows 실행 명령은 [Backend README](./backend/README.md)를 참고합니다.
아래 명령은 레포 루트에서 각각 별도 터미널로 실행합니다.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

```bash
cd frontend
npm install
npm run dev
```

Storybook은 프론트엔드 개발 서버와 별도로 실행합니다.

```bash
cd frontend
npm run storybook
```

- 프론트엔드: http://localhost:5173
- Storybook: http://localhost:6006
- 백엔드 API 문서: http://localhost:8000/docs

## 라이선스

이 프로젝트는 MIT License를 따릅니다. 자세한 내용은 [LICENSE](./LICENSE)를 참고해주세요.
