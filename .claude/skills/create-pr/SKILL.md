---
name: create-pr
description: TIMO 프론트 커밋·PR 생성 — 한국어 커밋 메시지 작성, feature 브랜치 확인, gh로 PR 생성. "커밋", "commit", "PR 만들어", "MR", "올려줘" 요청 시 사용
---

# TIMO 커밋 & PR 생성

## Phase 1: 변경 분석 & 커밋 분할 (기본: 쪼갠다)

1. `git status`, `git diff`(unstaged 포함)로 변경 전체 확인
2. **한 덩어리로 몰지 말고 논리 단위로 쪼갠다.** 아래 기준으로 그룹을 나눈다.
   - **type 다르면 분리**: `feat` / `fix` / `docs` / `refactor` / `chore` 가 섞이면 각각 커밋
   - **기능(feature)/도메인 다르면 분리**: 예) reflection 수정과 groups 수정은 별도 커밋
   - **관심사 다르면 분리**: 로직 변경 vs 문서 vs 설정(config·hook)
3. 그룹별로 커밋 계획을 세워 사용자에게 먼저 보여준다 (커밋 N개, 각 메시지·포함 파일).
4. 쪼개기 애매한 작은 변경(오타·연관된 한 묶음)은 억지로 나누지 않는다.

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
2. 사용자에게 커밋 계획(그룹별 메시지·파일) 보여주고 확인
3. 승인 시 **그룹별로** `git add <해당 파일들>` → 커밋을 반복한다 (한 그룹씩 순서대로). 파일이 한 그룹에 온전히 속하지 않아 조각내야 하면 그 부분만 짚어 안내한다

## Phase 4: PR 생성 (요청 시)

0. **문서 동기화 확인 (PR 전 1회)** — 이번 브랜치에서 구조/설정 파일이 바뀌었는지 본다.
   ```bash
   git diff --name-only main...HEAD | grep -qE 'app/.*(page|route)\.(tsx|ts)|src/.*|package\.json|proxy\.ts|\.claude/(skills|agents)/'
   ```
   해당되면 `docs/architecture.md`·`AGENTS.md`·`docs/tech-stack.md`가 최신인지 확인하고, 낡았으면 **`sync-docs` 스킬로 먼저 갱신**한 뒤 그 변경도 커밋에 포함한다.
1. 푸시
   - 첫 푸시(upstream 없음): `git push -u origin <branch>` — `-u`는 upstream을 걸어 이후 `git push`/`pull`을 인자 없이 쓰게 함
   - 이미 tracking 중이면 `-u` 불필요, 그냥 `git push`
2. **제목**: `[Type] 요약` — type 첫 글자 대문자 + 대괄호 (`[Feat]` `[Fix]` `[Docs]` `[Refactor]` `[Style]` `[Test]` `[Chore]`)
3. **본문**: `.github/PULL_REQUEST_TEMPLATE.md` 형식을 그대로 채운다. 기준은 **이 PR 링크만 처음 본 사람(팀 외부·채용 리뷰 포함)도 배경 없이 읽고 이해**할 수 있는 자기완결적인 글이다. 단순 파일 나열 금지.
   - **What is this PR?**: 문제·배경 → 이 PR이 해결하는 것을 서술한다. "무엇을/왜"가 먼저 오고, 코드를 안 봐도 큰 그림과 **결과·효과(임팩트)**가 잡히게 쓴다
   - **Changes**: 주요 변경을 **왜 그렇게 했는지**(설계 결정·트레이드오프) 중심으로 설명한다. 필요하면 Before → After로 대비한다. 사소한 파일까지 나열하지 말고 핵심 위주로 묶는다
   - 리뷰 포인트나 확인 방법(테스트/재현 절차)이 있으면 함께 적어 리뷰를 돕는다
   - 과장 없이 사실 기반으로 쓰되, 무엇을 얻었는지(중복 제거·자동화·토큰 절감 등)를 분명히 드러낸다
   - **Related Issues**: 관련 이슈가 있으면 `close #{이슈번호}` (머지 시 자동 닫힘). 브랜치명 `...-#{이슈번호}`에서 추출하거나 사용자에게 확인. 없으면 `없음`
   - **Screenshot**: UI 변경이면 스크린샷/GIF, 아니면 `해당 없음`
   - **Check List**: 템플릿의 6개 항목을 **항상 전부 표시**하고, 충족된 항목은 `[x]`로 체크
4. `gh pr create` 옵션:
   - `--title "[Type] 요약"` / `--body <채운 템플릿>`
   - `--assignee @me`
   - `--reviewer <상대>` — 작성자와 **교차 리뷰**: 작성자 `jeongyou` → 리뷰어 `baegyeong`, 작성자 `baegyeong` → 리뷰어 `jeongyou` (작성자는 `git config user.name` 또는 `gh api user --jq .login`로 확인)
   - `--label <이름>` — 레포에 존재하는 라벨만 (`gh label list`로 확인)
5. **머지 전략은 팀 합의** 따름 (직접 머지 금지)

## 결과 리포트

```
### 커밋: <type>: 요약
### 브랜치: feature/...
### PR: <url> (생성 시)
```
