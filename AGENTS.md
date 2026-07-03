# AGENTS.md — 팀 코드 표준 (인덱스)

이 문서는 팀의 코드 생성/수정/리뷰 기준의 **진입점(목차)**이다. 실제 내용은 `docs/`에 있고, 이 문서는 그 위치를 가리킨다.

## 적용 범위 & 우선순위

- 적용 범위: 레포지토리 전체
- 우선순위: 폴더별 `AGENTS.md`(존재 시) > 루트 `AGENTS.md`(이 문서) > 기타 문서
- 특정 도메인/폴더에 추가 규칙이 필요하면 해당 폴더에 `AGENTS.md`를 추가한다.

## 문서 (단일 소스)

| 내용 | 위치 |
|------|------|
| 규칙 · 코드 컨벤션 (확장자·타입·import·토큰·커밋 등) | `docs/conventions.md` |
| 아키텍처 · 라우트 · 인증 | `docs/architecture.md` |
| 기술 스택과 선택 이유 | `docs/tech-stack.md` |
| React/Next 성능 규칙 | `.agents/skills/vercel-react-best-practices/` |
| 작업 코드 템플릿 | `.claude/skills/` (`create-api-hook`, `create-component`, `create-test`, `create-e2e`, `create-pr`, `code-review`, `refactor`, `sync-docs`) |
| 전수 감사 에이전트 | `.claude/agents/` (`a11y-audit`) |
| 작업 금지선 (main push 금지 등) | `.claude/rules.md` |

규칙 문서는 항상 로드한다:

@docs/conventions.md

## 필수 명령어

- 개발: `pnpm dev` / `pnpm build` / `pnpm start` / `pnpm storybook`(port 6006)
- 품질: `pnpm lint` / `pnpm typecheck`
- 테스트: `pnpm test`는 no-op. 컴포넌트 테스트는 Storybook + Vitest 애드온

## 스킬 사용 규칙

- 스킬 위치는 두 곳이며 아래 규칙은 양쪽 모두 적용된다.
  - `.claude/skills/` — 팀 작업 템플릿
  - `.agents/skills/vercel-react-best-practices/` — React/Next 성능 규칙
- 스킬 권장 사항이 이 표준(`docs/conventions.md`)과 충돌하면 **표준을 우선**한다.
- 스킬 기준으로 더 나은 구조·패턴이 있어도 자동 적용하지 말고 **제안 형태로만** 설명한다 (왜 더 나은지 + 지금 구조에서의 장단점 포함).

## AI 사용 규칙

- 어떤 AI 도구를 쓰든 결과물은 이 표준을 따르고 `pnpm lint`, `pnpm typecheck`를 통과해야 한다.
- 특정 도메인에 규칙이 있으면 해당 폴더의 `AGENTS.md`를 우선 적용한다.
