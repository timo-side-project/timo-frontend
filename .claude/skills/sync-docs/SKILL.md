---
name: sync-docs
description: 코드 구조 변경을 문서에 반영 — 라우트·디렉토리 트리(docs/architecture.md), 스킬·에이전트 목록(AGENTS.md), 의존성·스택(docs/tech-stack.md), 기능 목록 누락(docs/product.md)을 실제 코드 기준으로 최신화. "docs 최신화", "문서 동기화", "sync docs", "문서 최신화" 요청 시 사용
---

# TIMO 문서 동기화

코드에서 **파생 가능한 사실**만 문서에 반영한다. 규칙·컨벤션(사람이 정하는 판단)은 건드리지 않는다.

## Phase 1: 실제 구조 수집

```bash
# 라우트
find app -type f \( -name 'page.tsx' -o -name 'route.ts' \) | sort
# src 디렉토리 트리
find src -maxdepth 3 -type d | sort
# UI / layout / features 목록
ls src/components/ui src/components/layout src/components/features
# 의존성 버전
cat package.json  # dependencies / scripts
# 미들웨어 존재
ls proxy.ts middleware.ts 2>/dev/null
```

## Phase 2: 문서와 비교 → 어긋난 곳만 수정

각 문서를 읽고 **실제 구조와 다른 부분만** 고친다. 멀쩡한 곳은 그대로 둔다.

- **docs/architecture.md**
  - 디렉토리 트리: 새 폴더/삭제된 폴더 반영
  - 라우트 표: 추가/삭제된 `page.tsx`·`route.ts` 반영
  - 미들웨어/인증: `proxy.ts` 또는 페이지 서버 컴포넌트 로직 변경 시 갱신
- **AGENTS.md** (인덱스)
  - 사용자가 스킬/에이전트를 새로 추가·삭제했다고 알려준 경우에만 "문서" 표에 반영 (다른 스킬의 내부 파일을 직접 열람하지 않는다)
- **docs/tech-stack.md**
  - `package.json` 주요 의존성 버전/추가·제거 반영
- **docs/conventions.md**
  - **자동 수정하지 않는다.** 규칙 변경은 사람이 결정. 단, 명백히 코드와 어긋난 사실(예: 별칭 경로)이 보이면 **지적만** 하고 확인을 받는다.
- **docs/product.md**
  - `src/components/features/` 밑에 새 기능 폴더가 생겼는데 "기능별 요약"에 없으면 **누락만 지적** (설명·용어는 사람이 채움, 임의로 지어내지 않는다)
  - 문서에 있는 라우트/기능이 코드에서 삭제됐으면 해당 항목 제거
  - 해금 기준·카피 문구 등 도메인 규칙(코드만으로 파생 안 되는 값)은 자동 수정하지 않는다 — 코드 상수와 어긋나 보이면 **지적만** 하고 확인받는다
- **docs/product/*.md** (기능별 상세 스펙)
  - frontmatter의 `sources`·`routes` 경로가 실제로 존재하는지만 확인해서, 삭제·이동된 경로를 고친다
  - 규칙·예외 본문은 자동 수정하지 않는다 (사람 판단)

## Phase 3: 리포트

```text
### 동기화 결과
- [문서]: [무엇을 어떻게 바꿈]
### 변경 없음: [최신 상태인 문서]
### 확인 필요(자동 수정 안 함): [conventions 등 사람 판단 항목]
```

수정 후 `pnpm lint`·`pnpm typecheck`에는 영향 없으나, 변경 문서를 사용자에게 보여주고 확인받는다.
