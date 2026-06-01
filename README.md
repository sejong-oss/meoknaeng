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

- Frontend: React, Vite, TailwindCSS, React Router, React Query, Zustand, Storybook
- Backend: FastAPI, SQLAlchemy Async, Alembic, MySQL, LangChain Google GenAI, YouTube Data API, Naver Image Search API

## 모노레포 구조

```text
.
├── frontend/       # 프론트엔드 애플리케이션
├── backend/        # FastAPI API 서버
├── .github/        # 이슈/PR 템플릿
├── README.md       # 프로젝트 안내
└── CONTRIBUTING.md # 협업 규칙
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

## 빠른 시작

백엔드의 `backend/.env`, 프론트엔드의 `frontend/.env`를 먼저 설정합니다. 자세한 환경변수는 각 파트별 README를 참고합니다.

백엔드 실행 예시는 macOS/Linux 기준입니다. Windows 실행 명령은 [Backend README](./backend/README.md)를 참고합니다.

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
