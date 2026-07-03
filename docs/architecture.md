# 아키텍처

**Next.js 16 App Router + React 19** 기반의 회고 저널링 앱(TIMO). 스택 개요는 [tech-stack.md](./tech-stack.md), 코드 컨벤션은 [conventions.md](./conventions.md) 참고.

## 디렉토리 구조

```text
app/                                  # 라우트 (App Router) — URL·레이아웃 정의만
  layout.tsx                          # 루트 레이아웃 (폰트, 메타, providers)
  providers.tsx                       # 클라이언트 프로바이더 (React Query 등)
  global-error.tsx                    # 전역 에러 바운더리
  manifest.json, icon*, apple-icon    # PWA 자산
  (home)/page.tsx                     # 홈 '/' (route group)
  login/ onboarding/ calendar/ …      # 각 라우트 page.tsx
  ztpi-test/(complete) ztpi/[ztpiTestId]/
  reflection/[reflectionId]/feedback/
  groups/create/  profile/nickname/
  test-auth/                          # 개발용 로그인 화면
  api/proxy/[...path]/route.ts        # 개발용 API 프록시 (route handler)

proxy.ts                              # 미들웨어 (Next 16 미들웨어 파일), matcher '/'

src/
  components/
    ui/           # 범용 UI 컴포넌트 (Badge, Button, Card, ErrorState, Icon,
                  #   Modal, ProgressBar, Radio, Skeleton, TimeWheelPicker, Toast, ToggleSwitch)
    layout/       # 페이지 레이아웃 (BottomNavBar, PageHeader, BottomCTA)
    features/     # 기능별 묶음 (home, reflection, reflectionDetail, reflectionFeedback,
                  #   calendar, groups, characters, notification, onboarding, profile,
                  #   test, testAuth, testResult, serviceFeedback, users, pwa)
                  #   각 feature: 컴포넌트 폴더 + queries/ + constants/ + hooks/
  hooks/          # 공용 커스텀 훅 (useToast)
  lib/
    api/          # HTTP 클라이언트 — instance.ts, http.ts, schema.ts, error.ts, index.ts
    config/env.ts # API base URL 결정 (SSR/dev proxy 분기)
    constants/    # 상수 (character.ts)
    firebase/     # FCM 푸시 (client.ts, messaging.ts)
    helpers/      # 유틸 (cn, getQueryClient, navigation, calculateProgress,
                  #   formatTwoDigitNumber, getCharacterAsset)
  styles/         # globals.css (@theme 디자인 토큰), typography.css
```

폴더 역할·import 방향 규칙은 [conventions.md](./conventions.md)(폴더 역할 / import·파일 배치)를 단일 기준으로 한다.
환경 변수(`.env`) 자체는 레포 루트에 있고, `src/lib/config/env.ts`는 그 값을 읽어 base URL을 결정하는 모듈이다(파일 자체가 환경 변수는 아님).

## 미들웨어 & 인증

인증은 **미들웨어 + 페이지 서버 컴포넌트** 두 층으로 처리한다.

### 1. 미들웨어 — `proxy.ts`

Next.js 16의 미들웨어 파일(`proxy` 함수를 export). `config.matcher: ['/']` 라서 **홈 `/` 진입 시에만** 실행된다.

- `access_token` 쿠키가 유효하면 → 통과 (`NextResponse.next()`)
- 만료됐고 `refresh_token`이 있으면 → 백엔드 `reissue` 엔드포인트로 토큰 재발급 → 응답의 `set-cookie`를 실어 원 URL로 재요청 (dev 환경에선 `domain=`·`secure` 속성 제거)
- `refresh_token`이 없으면 → `/onboarding`으로 리다이렉트
- 재발급 실패 시 → `refresh_token` 삭제 후 `/login`으로 리다이렉트

### 2. 페이지 서버 컴포넌트

미들웨어가 커버하지 않는 페이지는 서버 컴포넌트에서 직접 확인한다. 예) 홈 `app/(home)/page.tsx`:

- `/users/me` 조회 → 응답 실패 시 `/login`으로 리다이렉트
- `isOnboarded`가 false면 → `/ztpi-test`로 리다이렉트

## 라우트

| 경로 | 설명 |
|------|------|
| `/` | 홈 (route group `(home)`, 미들웨어 `proxy.ts`가 토큰 가드) |
| `/login` | 로그인 |
| `/onboarding` | 온보딩 |
| `/ztpi-test`, `/ztpi-test/complete`, `/ztpi/[ztpiTestId]` | ZTPI 성격 테스트 |
| `/calendar` | 캘린더 |
| `/reflection`, `/reflection/[reflectionId]`, `/reflection/[reflectionId]/feedback` | 회고 (목록·상세·피드백) |
| `/groups`, `/groups/create` | 그룹 회고 (목록·생성) |
| `/characters` | 캐릭터 선택 |
| `/notification` | 알림 |
| `/profile`, `/profile/nickname` | 프로필 (프로필·닉네임 변경) |
| `/test-auth` | 개발용 로그인 |
| `/api/proxy/[...path]` | 개발용 API 프록시 (route handler) |

## 상태 관리

- **서버 상태**: TanStack React Query v5 — staleTime 기본 1분, DevTools는 개발 모드에서만 활성화. 쿼리 훅은 `features/[feature]/queries/`에 위치
- **전역 상태**: Zustand v5
- **로컬 상태**: React 훅 (`useState`, `useRef`)

## API / 데이터 페칭

`src/lib/api/`의 Axios 기반 클라이언트를 사용한다.

- `instance.ts`: base URL(`config/env.ts`에서 결정), 타임아웃(10s), `withCredentials`, SSR 쿠키 전달 인터셉터, 401 시 재발급 후 원 요청 재시도(동시 재발급 방지)
- `http.ts`: `get`, `post`, `patch`, `del` 래퍼
- `schema.ts`: Zod 요청/응답 검증 (`responseSchema` 옵션)
- base URL 분기(`config/env.ts`): 서버는 `NEXT_PUBLIC_API_BASE_URL` 직접 사용, **개발 클라이언트는 `/api/proxy`** 경유(CORS 회피), 프로덕션 클라이언트는 직접 사용
- 사용 패턴은 [conventions.md](./conventions.md)(API/데이터 페칭)와 `create-api-hook` 스킬 참고

## 스타일링

- **Tailwind CSS v4**, 폰트 Noto Sans KR, 커스텀 색상 시스템 (Gray g-0~g-900, Primary=Yellow)
- 디자인 토큰·`cn()` 사용 규칙은 [conventions.md](./conventions.md)(디자인 토큰) 참고

## 성능

React/Next 성능 규칙과 코드 예제는 `.agents/skills/vercel-react-best-practices/` 스킬을 단일 기준으로 한다 (워터폴 제거, 번들 최적화, 리렌더 최소화 등 57개 규칙).
