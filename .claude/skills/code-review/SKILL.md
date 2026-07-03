---
name: code-review
description: TIMO 프론트 코드 리뷰 — 프로젝트 컨벤션·아키텍처·성능 규칙 기준으로 변경분을 점검. "리뷰", "review", "코드 봐줘", "PR 점검", "UI 품질 확인" 요청 시 사용
---

# TIMO 코드 리뷰

대상: $ARGUMENTS (없으면 `git diff` 변경분)

먼저 변경분을 확인한다: `git diff`(작업 중) 또는 `git diff main...HEAD`(브랜치 전체).

## 체크 항목

### 1. 규칙 위반 (AGENTS.md / rules.md)
- `any` 사용, 남은 `console.log`
- `src/**`에 `.js`/`.jsx`/`.mts` 파일
- 배럴 파일(`index.ts`) 임포트 — 직접 경로여야 함
- import 방향 위반 (`components/ui` → `features`, feature 간 직접 import, `lib` → 컴포넌트)
- 색상/간격 임의 값 — 디자인 토큰(`bg-g-0`, `text-g-100`)만 허용

### 2. 데이터 패턴 (docs/conventions.md)
- `axios` 직접 호출 (→ `get/post/patch/del` 래퍼 사용)
- 응답 Zod 검증(`responseSchema`) 누락
- 쿼리 키/엔드포인트가 `constants/`에 없이 하드코딩

### 3. UI 품질
- `ComponentProps` 확장 없이 props 중복 정의
- `cn()` 대신 문자열 결합
- 접근성: 인터랙티브 요소에 라벨/`aria-*`, 시맨틱 태그

### 4. 성능 (vercel-react-best-practices 스킬)
- 워터폴(순차 await), 불필요한 리렌더(인라인 객체 prop, effect 남용)
- 무거운 컴포넌트 `next/dynamic` 미적용

## 결과 형식
```
## 반드시 수정 (규칙 위반)
| 파일:라인 | 문제 | 수정 |

## 권장
| 파일:라인 | 문제 | 수정 |

## 판정: ✅ 통과 / ⚠️ 권장 반영 / ❌ 수정 필수
```

지적은 **파일:라인 + 근거 규칙**을 함께 제시한다. 자동 수정은 하지 않고 제안만 한다 (요청 시 수정).
