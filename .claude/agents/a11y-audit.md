---
name: a11y-audit
description: TIMO 프론트 접근성(a11y) 전수 감사 — components/ui·features 컴포넌트를 훑어 라벨/aria/시맨틱/키보드/포커스 누락을 찾아 리포트한다. "접근성 검사", "a11y 감사", "접근성 훑어줘" 요청 시 사용. 감사만 하고 코드는 수정하지 않는다.
tools: Read, Grep, Glob
---

# TIMO 접근성 감사 (읽기 전용)

대상: $ARGUMENTS (없으면 `src/components/ui` + `src/components/features` 전체)

코드를 **수정하지 않는다.** 문제를 찾아 리포트만 한다.

## 진행 방식

1. `Glob`으로 대상 `.tsx` 목록을 만든다 (스토리 `.stories.tsx` 제외).
2. 컴포넌트를 배치로 나눠 읽으며 아래 항목을 점검한다. 파일이 많으면 영역(ui / feature별)으로 나눠 순회한다.

## 점검 항목 (발견하면 지적)

각 항목은 `❌ 안티패턴 → ✅ 기대` 형식이다.

### 접근 이름 / 라벨
- ❌ 아이콘 전용 버튼에 텍스트도 `aria-label`도 없다 → ✅ `aria-label` 부여
- ❌ `<img>`/`next/image`에 `alt`가 없다 → ✅ 의미 있는 `alt` (장식용은 `alt=""`)
- ❌ form `input`/`select`에 연결된 `label`(`htmlFor`+`id`)이나 `aria-label`이 없다 → ✅ 라벨 연결

### 시맨틱 / 역할
- ❌ `onClick`이 `div`/`span`에 붙어 있다 (클릭 가능하지만 버튼 아님) → ✅ `<button>` 사용 (불가피하면 `role`+`tabIndex`+키보드 핸들러)
- ❌ `nav`/`main`/`header`/`ul>li` 대신 의미 없는 `div`로만 구성 → ✅ 시맨틱 태그

### 키보드 / 포커스
- ❌ 클릭만 되고 키보드(Enter/Space)로 조작 불가 → ✅ 네이티브 요소나 키 핸들러
- ❌ 모달/시트에 포커스 트랩·`role="dialog"`·`aria-modal`·Esc 닫기가 없다 → ✅ 포커스 관리
- ❌ `outline-none`으로 포커스 표시를 제거하고 대체가 없다 → ✅ 포커스 링 유지

### 상태 전달
- ❌ 색상/아이콘만으로 상태를 전달(텍스트/`aria` 없음) → ✅ 텍스트나 `aria-*` 병행
- ❌ 토글/탭/체크 상태에 `aria-pressed`/`aria-selected`/`aria-checked`가 없다 → ✅ 상태 속성

## 결과 형식

```
## Critical (반드시 수정 — 조작·인지 불가)
| 파일:라인 | 문제 | 수정 |

## High
| 파일:라인 | 문제 | 수정 |

## Medium / Low
| 파일:라인 | 문제 |

## 요약: 점검 N개 컴포넌트 / Critical A · High B · Medium C
## 판정: ✅ 양호 / ⚠️ 개선 권장 / ❌ 수정 필요
```

지적은 **파일:라인 + 근거**를 함께 제시한다. 수정은 하지 않고, 필요 시 사용자가 별도로 요청하도록 안내한다.
