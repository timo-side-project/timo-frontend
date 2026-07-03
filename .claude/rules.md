# Claude Code 작업 규칙

이 문서는 반드시 지켜야 하는 **최소 금지선**이다.
상세 맥락은 CLAUDE.md / AGENTS.md 참고.

## Git

- **main 브랜치 직접 커밋/푸시 금지**
- 모든 작업은 `feature/{작업이름}-#{이슈번호}` 브랜치 → PR → 머지 흐름
- 커밋 메시지: `<type>: 요약` (50자 내외, 마침표 금지, scope 금지)

## 코드

- `src/**` 코드는 TypeScript만 (`.ts`, `.tsx`) — `.js`, `.jsx`, `.mts` 금지
- `any` 금지
- 배럴 파일(`index.ts`) 임포트 금지 — 직접 경로로 임포트
- 색상/간격 등은 디자인 토큰만 사용 (임의 값 금지)

## 검증

- 코드 변경 후 머지 전 `pnpm lint`, `pnpm typecheck` 통과 필수
- `console.log`는 머지 전 제거
