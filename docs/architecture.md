# 아키텍처

**Next.js 16 App Router + React 19** 기반의 회고 저널링 앱(TIMO). 스택 개요는 [tech-stack.md](./tech-stack.md) 참고.

## 디렉토리 구조

```
app/                          # 라우팅 (App Router)
src/
  components/
    ui/                       # 범용 UI 컴포넌트 (Button, Modal 등)
    layout/                   # 페이지 레벨 레이아웃 (BottomNavBar, PageHeader 등)
    features/[feature]/       # 기능별 컴포넌트
  hooks/                      # 공용 커스텀 훅
  lib/
    api/                      # HTTP 클라이언트 (Axios + Zod)
    config/env.ts             # 환경 변수
    constants/                # 상수 및 엔드포인트
    helpers/                  # 유틸리티 함수
    firebase/                 # FCM 푸시 알림
```

폴더 역할·import 방향 규칙은 `docs/conventions.md`(폴더 역할 / import·파일 배치)를 단일 기준으로 한다.

## 라우트 및 인증

인증은 미들웨어 없이 각 페이지 서버 컴포넌트에서 `access_token` 쿠키를 확인해 처리한다.
온보딩 미완료 시 `/ztpi-test`로 리다이렉트.

- `/` → 홈 (route group `(home)`)
- `/onboarding` → 온보딩
- `/ztpi-test`, `/ztpi/[ztpiTestId]` → ZTPI 성격 테스트
- `/calendar` → 캘린더
- `/reflection`, `/reflection/[reflectionId]` → 회고
- `/groups` → 그룹 회고 (그룹 목록, 향후 `/groups/[groupId]` 상세 확장 가능)
- `/characters` → 캐릭터 선택
- `/profile`, `/profile/nickname` → 프로필
- `/api/proxy/[...path]` → 개발용 API 프록시

## 상태 관리

- **서버 상태**: TanStack React Query v5 — staleTime 기본 1분, DevTools는 개발 모드에서만 활성화
- **전역 상태**: Zustand v5
- **로컬 상태**: React 훅 (`useState`, `useRef`)
- 쿼리 훅은 `src/components/features/[feature]/queries/` 에 위치

## API / 데이터 페칭

`src/lib/api/` 에 Axios 기반 클라이언트가 있다.

- `instance.ts`: 기본 URL, 타임아웃(10s), `withCredentials`, SSR 쿠키 전달 인터셉터
- `http.ts`: `get`, `post`, `patch`, `del` 래퍼 함수
- `schema.ts`: Zod 기반 요청/응답 유효성 검사 (`responseSchema` 옵션으로 사용)
- 401 응답 시 `/auth/reissue`로 토큰 재발급 후 원 요청 재시도 (동시 재발급 방지 로직 포함)

## 스타일링

- **Tailwind CSS v4**, 폰트 Noto Sans KR, 커스텀 색상 시스템 (Gray g-0~g-900, Primary=Yellow)
- 디자인 토큰·`cn()` 사용 규칙은 `docs/conventions.md`(디자인 토큰) 참고

## 성능

React/Next 성능 규칙과 코드 예제는 `.agents/skills/vercel-react-best-practices/` 스킬을 단일 기준으로 한다 (워터폴 제거, 번들 최적화, 리렌더 최소화 등 57개 규칙).
