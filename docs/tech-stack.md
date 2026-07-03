# 기술 스택

회고 저널링 앱(TIMO)의 프론트엔드 스택과 선택 이유.

| 영역 | 기술 | 이유 |
|------|------|------|
| 프레임워크 | **Next.js 16** (App Router) | 서버 컴포넌트 기반 SSR, 라우트 그룹으로 구조화 |
| UI | **React 19** | 서버 컴포넌트, `use` 등 최신 API |
| 언어 | **TypeScript** (only) | 타입 안정성 — `src/**`는 `.ts`/`.tsx`만 |
| 패키지 매니저 | **pnpm** | 빠른 설치, 엄격한 의존성 |
| 스타일 | **Tailwind CSS v4** | `@theme` 디렉티브로 디자인 토큰 관리 |
| 서버 상태 | **TanStack Query v5** | 캐싱·중복 제거, staleTime 기본 1분 |
| 전역 상태 | **Zustand v5** | 가벼운 전역 스토어, 필요한 값만 셀렉터 구독 |
| HTTP | **Axios + Zod** | 인터셉터(SSR 쿠키/토큰 재발급) + 런타임 응답 검증 |
| 테스트 | **Storybook + Vitest 애드온** | 컴포넌트 단위 검증 (별도 `pnpm test` 없음) |
| 푸시 | **Firebase FCM** | 알림 |

상세 아키텍처는 [architecture.md](./architecture.md), 코드 컨벤션은 [conventions.md](./conventions.md) 참고.
