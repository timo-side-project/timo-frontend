---
name: code-review
description: TIMO 프론트 코드 리뷰 — 프로젝트 컨벤션·아키텍처·성능 규칙 기준으로 변경분을 점검. "리뷰", "review", "코드 봐줘", "PR 점검", "UI 품질 확인" 요청 시 사용
---

# TIMO 코드 리뷰

대상: $ARGUMENTS (없으면 `git diff` 변경분)

먼저 변경분을 확인한다: `git diff`(작업 중) 또는 `git diff main...HEAD`(브랜치 전체).

## 지적 대상 (아래 패턴이 코드에 **있으면** 문제로 리포트한다)

각 항목은 `❌ 발견하면 지적할 안티패턴 → ✅ 기대하는 형태` 형식이다.

### 1. 규칙 위반 (docs/conventions.md / rules.md)
- ❌ `any` 타입이 있다 → ✅ 구체 타입
- ❌ `console.log`가 남아 있다 → ✅ 제거
- ❌ `src/**`에 `.js`/`.jsx`/`.mts` 파일이 있다 → ✅ `.ts`/`.tsx`
- ❌ 배럴 파일(`index.ts`)에서 임포트한다 → ✅ 직접 경로
- ❌ import 방향을 어긴다 (`ui`→`features`, feature 간 직접 import, `lib`→컴포넌트) → ✅ 상위→하위 방향만
- ❌ 색상/간격에 임의 값을 쓴다 → ✅ 디자인 토큰(`bg-g-0`, `text-g-100`)

### 2. 데이터 패턴 (docs/conventions.md)
- ❌ `axios`를 직접 호출한다 → ✅ `get/post/patch/del` 래퍼
- ❌ 응답 Zod 검증(`responseSchema`)이 없다 → ✅ 스키마로 검증
- ❌ 쿼리 키·엔드포인트를 하드코딩한다 → ✅ `constants/`의 `queryKeys.ts`·`url.ts`

### 3. UI 품질
- ❌ `ComponentProps` 확장 없이 네이티브 props를 중복 정의한다 → ✅ `ComponentProps<'el'>` 확장
- ❌ `cn()` 없이 클래스를 문자열로 이어 붙인다 → ✅ `cn()` 사용
- ❌ 인터랙티브 요소에 라벨/`aria-*`·시맨틱 태그가 없다 → ✅ 접근성 속성 부여

### 4. 성능 (vercel-react-best-practices 스킬)
- ❌ 워터폴(불필요한 순차 await)이 있다 → ✅ 병렬화
- ❌ 불필요한 리렌더 유발(인라인 객체 prop, effect 남용)이 있다 → ✅ 안정 참조/파생
- ❌ 무거운 컴포넌트에 `next/dynamic`이 없다 → ✅ 동적 임포트

## 결과 형식
```text
## 반드시 수정 (규칙 위반)
| 파일:라인 | 문제 | 수정 |

## 권장
| 파일:라인 | 문제 | 수정 |

## 판정: ✅ 통과 / ⚠️ 권장 반영 / ❌ 수정 필수
```

지적은 **파일:라인 + 근거 규칙**을 함께 제시한다. 자동 수정은 하지 않고 제안만 한다 (요청 시 수정).
