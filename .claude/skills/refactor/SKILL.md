---
name: refactor
description: TIMO 프론트 리팩토링 — 컴포넌트 분리, 커스텀 훅 추출, 타입 개선을 프로젝트 컨벤션 기준으로 수행. 기능 변화 없이 구조만 개선. "리팩토링", "refactor", "컴포넌트 쪼개", "훅 추출", "정리해줘" 요청 시 사용
---

# TIMO 리팩토링

대상: $ARGUMENTS

**원칙: 동작(기능) 변화 없음.** 커밋 시 `refactor:` prefix.

## Phase 1: 분석

- 대상 코드 흐름 파악, 냄새 식별:
  - 컴포넌트 과대(렌더+데이터+로직 혼재) → 분리 대상
  - 반복되는 상태/로직 → 커스텀 훅 추출 대상 (`src/hooks/` 또는 feature 내부)
  - 넓은 타입/`any`/중복 타입 → 타입 개선 대상

## Phase 2: 컨벤션 기준 개선 (docs/conventions.md)

- **컴포넌트 분리**: UI/features 위치 규칙 유지, `ComponentProps` 확장, `default export`
- **훅 추출**: `use*` 네이밍, `hooks`는 `lib`/`types`에만 의존
- **데이터 로직**: 컴포넌트 안 fetch → `queries/` 훅으로 이동
- **타입**: `import type` 선호, `any` 제거, 공용 타입은 `types/`
- import 방향/배럴 금지 규칙 유지

## Phase 3: 검증

- `pnpm typecheck`, `pnpm lint` 통과
- 동작 동일 확인 (Storybook/화면 깨짐 없음)

## 결과 리포트
```
### 변경 요약 (기능 불변)
- [파일]: [무엇을 어떻게]
### 추출: [훅/컴포넌트명]
### 상태: ✅ typecheck·lint 통과
```
