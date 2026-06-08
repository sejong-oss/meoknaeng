# 뭐해먹냉 Frontend

뭐해먹냉의 프론트엔드 애플리케이션입니다.

## 주요 화면

- 온보딩: 서비스 진입 화면
- 홈: 재료 입력, 자동완성, 추천 요청
- 추천 결과: AI가 추천한 레시피 목록과 대표 이미지
- 레시피 상세: 대표 이미지, 요리 정보(시간, 난이도, 분량), 재료, 조리 순서, 관련 YouTube 영상
- 공유 피드: 사용자 레시피 경험 공유, 대표 이미지, 검색, 필터, 댓글, 좋아요
- 글쓰기: 저장된 레시피를 바탕으로 공유 글 작성
- 마이페이지: 내 재료, 저장 레시피, 작성 글, 좋아요한 글 관리

## 기술 스택

- React 19
- Vite 8
- TailwindCSS v4
- React Router v7
- TanStack React Query
- Zustand
- motion/react
- Carbon Icons
- Radix UI 기반 공통 컴포넌트
- Storybook

## 사전 준비 사항

- Node.js 20.19 이상 또는 22.12 이상
- npm
- 실제 API 연동 확인을 위한 백엔드 서버

## 환경변수

`frontend/.env.example` 파일을 복사해 `frontend/.env` 파일을 생성하고 아래 값을 설정합니다.

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:8000
```

환경변수 설명:

- `VITE_API_BASE_URL`: 백엔드 API 서버 주소

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 http://localhost:5173 에서 실행됩니다.

Storybook은 개발 서버와 별도로 실행합니다.

```bash
npm run storybook
```

Storybook은 기본적으로 http://localhost:6006 에서 실행됩니다.

## 확인 명령

```bash
npm run build
npm run lint
npm run storybook
```

- `npm run build`: 배포용 빌드 확인
- `npm run lint`: ESLint 검사
- `npm run storybook`: 공통 컴포넌트와 UI 상태 확인

## 디렉토리 구조

```text
frontend/
├── public/        # 정적 파일
├── src/
│   ├── assets/    # 전역 스타일, Tailwind theme token
│   ├── components/# 공통 UI 컴포넌트
│   ├── hooks/     # 화면/데이터 훅
│   ├── layouts/   # 공통 레이아웃
│   ├── libs/      # API 클라이언트, 상수, 유틸
│   ├── pages/     # 라우트 단위 화면
│   ├── store/     # 전역 상태
│   └── stories/   # Storybook 문서
├── package.json
└── vite.config.js
```

## 개발 원칙

- 색상은 `src/assets/index.css`의 Tailwind theme token을 사용합니다.
- 공통 UI는 `src/components/`의 컴포넌트를 우선 사용합니다.
- 공통 컴포넌트를 수정하면 관련 Storybook 예시도 함께 확인합니다.
- 프론트엔드 기능은 loading, empty, error 상태를 함께 고려합니다.
