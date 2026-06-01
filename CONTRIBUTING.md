# 기여 가이드

뭐해먹냉의 이슈, 브랜치, 커밋, PR 규칙을 정리합니다.

## 메인 브랜치

- `develop`: 기능 개발과 수정 사항을 통합하는 기본 브랜치
- `main`: 안정 버전을 관리하는 브랜치

일반 작업은 `develop`에서 새 브랜치를 만들어 진행합니다.

## 보조 브랜치

- `feat/*`: 새로운 기능
- `fix/*`: 버그 수정
- `refactor/*`: 동작 변경 없는 구조 개선
- `style/*`: 코드 동작에는 영향을 주지 않는 스타일 수정
- `chore/*`: 설정, 빌드, 배포, 기타 작업
- `docs/*`: 문서 작업
- `release/*`: 배포 후보 준비
- `hotfix/*`: 운영 버전 긴급 수정

예시:

```text
feat/recipe-recommendation-api-integration
fix/vercel-spa-routing
refactor/common-api-response
docs/readme-update
release/v1.0.0
hotfix/session-cookie
```

## 작업 흐름

1. GitHub Issue를 생성합니다.
2. `develop`에서 작업 브랜치를 생성합니다.
3. 작업 범위를 작게 유지하며 구현합니다.
4. 의미 있는 단위로 커밋합니다.
5. Pull Request를 생성하고 관련 이슈를 연결합니다.
6. 리뷰를 반영하고 빌드 또는 테스트 결과를 확인합니다.
7. 승인 후 `develop`에 병합합니다.

## 릴리즈 흐름

릴리즈는 `develop -> release/* -> main` 흐름으로 진행합니다.

1. 배포 후보가 준비되면 `develop`에서 `release/*` 브랜치를 생성합니다.
2. `release/*`에서는 버그 수정, 문서 보완, 설정 점검 등 안정화 작업만 진행합니다.
3. 검증이 끝나면 `release/*`를 `main`에 병합합니다.
4. `main` 병합 후 같은 변경사항을 `develop`에도 반영해 브랜치 차이를 줄입니다.
5. 필요한 경우 `main`에 버전 태그를 추가합니다.

## Hotfix 흐름

`main`에 반영된 안정 버전에서 긴급 수정이 필요한 경우 `hotfix/*` 브랜치를 사용합니다.

1. `main`에서 `hotfix/*` 브랜치를 생성합니다.
2. 긴급 수정에 필요한 최소 변경만 반영합니다.
3. 검증이 끝나면 `hotfix/*`를 `main`에 병합합니다.
4. 같은 수정사항을 `develop`에도 반영합니다.
5. 필요한 경우 `main`에 패치 버전 태그를 추가합니다.

## 커밋 메시지

Conventional Commits 형식을 사용하고, 제목은 한국어 서술형으로 작성합니다.

```text
feat: 레시피 추천 결과를 저장하도록 구현
fix: 새로고침 시 인증 상태를 복구하도록 수정
refactor: 피드 응답 필드명을 camelCase로 정리
docs: 실행 방법을 README에 정리
```

자주 사용하는 타입:

- `feat`: 기능 추가
- `fix`: 버그 수정
- `refactor`: 리팩터링
- `style`: 코드 동작에는 영향을 주지 않는 스타일 수정
- `docs`: 문서 수정
- `chore`: 설정, 빌드, 의존성, 기타 작업
- `test`: 테스트 추가 또는 수정

## Pull Request 규칙

PR에는 기존 `.github/pull_request_template.md` 양식을 사용합니다.

- 관련 이슈를 `Closes #이슈번호` 형식으로 연결합니다.
- 작업 내용을 짧고 구체적으로 작성합니다.
- 리뷰어가 봐야 할 지점을 남깁니다.
- 확인한 명령이 있다면 결과를 적습니다.
  - 예: `npm run build`
  - 예: `npm run lint`
  - 예: `alembic upgrade head`

## Issue 규칙

기능 개발과 버그 수정은 `.github/ISSUE_TEMPLATE`의 템플릿을 사용합니다.

- 기능 이슈: 개발 목적과 기대 동작을 적습니다.
- 버그 이슈: 문제 상황과 재현 방법을 적습니다.

## 코드 작업 원칙

- 변경 범위 밖의 리팩터링을 섞지 않습니다.
- 민감 정보는 커밋하지 않습니다.
  - API key
  - DB 비밀번호
  - 세션 secret
  - 실제 `.env` 파일
- 프론트엔드는 공통 컴포넌트와 Tailwind theme token을 우선 사용합니다.
- 백엔드는 router, schema, service, model의 책임을 분리합니다.
- 사용자에게 보이는 기능은 loading, empty, error 상태를 함께 고려합니다.

## 문서 작업 원칙

- 루트 `README.md`는 모노레포 안내와 빠른 시작 위주로 유지합니다.
- `frontend/README.md`와 `backend/README.md`에 파트별 실행 방법을 정리합니다.
