# 코드 컨벤션

TIMO 프론트 코드 생성/수정/리뷰의 **단일 기준**. 규칙과 실무 패턴을 함께 담는다.
작업별 코드 템플릿은 `.claude/skills/`의 스킬(`create-api-hook`, `create-component`, `create-pr`, `code-review`, `refactor`)을 참고한다.

## 포맷팅 / 린트

- 포맷·린트의 단일 기준(source of truth)은 설정 파일이다.
  - Prettier: `.prettierrc`, `.prettierignore`
  - ESLint: `eslint.config.mjs`
- 실행은 `pnpm lint`, `pnpm typecheck`만 사용한다.

## 파일 확장자

- `src/**` 코드는 TypeScript만 허용: `.ts`, `.tsx` (금지: `.js`, `.jsx`, `.mts`)
- CSS/이미지/폰트 등 정적 자산 파일은 허용
- 설정 파일 예외: `eslint.config.mjs`, `commitlint.config.mjs`, `next.config.*` 등

## TypeScript / React 규칙

- `any` 사용 금지 (ESLint 기준)
- 사용하지 않는 변수는 `_` prefix로 명시
- `console.log`는 개발 중 사용 가능하나 머지 전 제거
- 타입은 `import type { ... }` 형태 선호
- 커스텀 훅은 `use*` 네이밍

## import / 파일 배치

- import 경로 별칭은 `@/src/...`
- 배럴 파일(`index.ts`) 임포트 금지 — 직접 경로로 임포트
- import 방향은 **상위 역할 → 하위 역할**만 허용
  - 허용: `app` → 전부 / `features` → `ui`·`hooks`·`lib`·`types` / `layout` → `ui`·`features` / `hooks` → `lib`·`types`
  - 지양: `ui` → `features` / `lib` → 컴포넌트(`components`·`hooks`) / feature 간 직접 import
- 한 기능(feature)은 아래 구조를 가진다. 컴포넌트는 위치와 무관하게 항상 `[Name]/[Name].tsx` 폴더 방식.

```text
src/components/features/[feature]/
  [Component]/
    [Component].tsx
    [Component].stories.tsx   # 필요 시
  hooks/             # feature 전용 훅 (use*)
  queries/           # React Query 훅 (쿼리 1개당 파일 1개)
  constants/
    queryKeys.ts     # 쿼리 키 팩토리
    url.ts           # 엔드포인트 상수
```

## 폴더 역할

- **app/**: 라우트·레이아웃 정의만 (`page.tsx`, `layout.tsx`, route group). 공용 컴포넌트·비즈니스 로직 지양
- **components/ui**: 어디서든 재사용 가능한 순수 UI. 특정 기능에 종속 금지
- **components/layout**: 페이지 구조(Header, Footer, Sidebar 등)
- **components/features/[feature]**: 기능별 컴포넌트. 다른 feature에서 직접 참조 지양, 공통화되면 `ui/`로 승격
- **lib**: 유틸리티·API 함수·상수. React 컴포넌트에 의존하지 않음
- **hooks**: React 커스텀 훅 (`use*`)
- **types**: 전역 공유 타입

## API / 데이터 페칭

- HTTP는 `src/lib/api`의 `get / post / patch / del` 래퍼만 사용 — `axios` 직접 호출 금지
- 응답은 Zod 스키마로 검증(`responseSchema` 옵션), 타입은 `z.infer`로 추론
- 쿼리 키는 `constants/queryKeys.ts` 팩토리, 엔드포인트는 `constants/url.ts` 상수로 관리

## 컴포넌트

- 배치 기준:
  - **범용(어디서든 재사용)** → `components/ui/[Name]/[Name].tsx`
  - **특정 feature 전용** → `components/features/[feature]/[Name]/[Name].tsx`
  - 공통으로 쓰이기 시작하면 `ui/`로 승격
- `ComponentProps<'element'>` 확장, `default export`
- 조건부 클래스는 `cn()` 헬퍼
- 같은 위치에 `[Name].stories.tsx` 작성
- 무거운 컴포넌트는 `next/dynamic`으로 동적 임포트 (예: Calendar는 `ssr: false`)

## 디자인 토큰

- 색상/타이포/간격은 임의 값 대신 **정의된 토큰만** 사용
- 정의 위치: CSS 변수 `src/styles/globals.css`의 `@theme` 블록, 타이포 유틸 `src/styles/typography.css`
- `@theme` 토큰은 Tailwind 유틸 클래스로 사용 (`bg-g-0/80`, `text-g-100`, `max-w-105`)
- CSS 변수 직접 참조가 필요할 때만 대괄호 문법 (`bg-[var(--color-g-0)]/80`) — `bg-(--color-g-0)/80`는 잘못된 예
- 새 값이 필요하면 토큰을 추가한 뒤 사용

## 전역 상태

- 꼭 필요할 때만 `zustand`(v5) 스토어를 만들고, 셀렉터로 필요한 값만 구독한다.

## 커밋 / 브랜치 / PR

- 브랜치: `feature/{작업이름}-#{이슈번호}`
- 커밋: `<type>: 요약` — 50자 이내, **마침표 금지**, **scope 금지**. body는 필요 시 각 줄 `-`로 시작 ("무엇을/왜")
- type: `feat` `fix` `docs` `style` `refactor` `test` `chore`
- commitlint: scope 금지 / subject 최대 50자 / subject 끝 마침표 금지 / body 각 줄 `-`
- PR 제목은 변경 내용을 설명하는 적절한 이름. 머지 전략은 팀 합의
- **main 직접 커밋/푸시 금지** (`.claude/rules.md`). 상세 워크플로우는 `create-pr` 스킬
