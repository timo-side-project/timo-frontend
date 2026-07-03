---
name: create-pr
description: TIMO 프론트 커밋·PR 생성 — 한국어 커밋 메시지 작성, feature 브랜치 확인, gh로 PR 생성. "커밋", "commit", "PR 만들어", "MR", "올려줘" 요청 시 사용
---

# TIMO 커밋 & PR 생성

## Phase 1: 변경 분석

1. `git status`, `git diff`(unstaged 포함)로 변경 확인
2. 변경을 논리 단위로 묶기 — 성격 다른 변경이 섞였으면 나눠서 커밋 제안

## Phase 2: 커밋 메시지 (AGENTS.md 규칙)

### 형식
```
<type>: 요약

- body 1
- body 2
```

### 규칙
- **type**: `feat` `fix` `docs` `style` `refactor` `test` `chore`
- **subject**: 50자 이내, **마침표 금지**, 한글 가능
- **scope 금지** (commitlint 정책)
- **body**: 필요할 때만, 각 줄 `-`로 시작, "무엇을/왜" 중심
- Co-Authored-By 등 자동 서명 **넣지 않음**

## Phase 3: 브랜치 & 커밋

1. 현재 브랜치 확인 — **main이면 커밋 금지** (rules.md). feature 브랜치 먼저 생성
   - 브랜치명: `feature/{작업이름}-#{이슈번호}`
2. 사용자에게 메시지 보여주고 확인
3. 승인 시 커밋

## Phase 4: PR 생성 (요청 시)

1. 푸시
   - 첫 푸시(upstream 없음): `git push -u origin <branch>` — `-u`는 upstream을 걸어 이후 `git push`/`pull`을 인자 없이 쓰게 함
   - 이미 tracking 중이면 `-u` 불필요, 그냥 `git push`
2. `gh pr create`로 생성:
   - `--title` — 변경 내용을 설명하는 적절한 이름
   - `--body` — 변경 요약 + 체크리스트
   - `--assignee @me` — 본인을 담당자로 지정
   - `--label <이름>` — 레포에 존재하는 라벨만 지정 (없으면 생략; `gh label list`로 확인)
3. **머지 전략은 팀 합의** 따름 (직접 머지 금지)

## 결과 리포트
```
### 커밋: <type>: 요약
### 브랜치: feature/...
### PR: <url> (생성 시)
```
