---
name: qa-pr-run
description: qa-pr(1단계) 시나리오를 Playwright 코드로 생성해 로컬에서 실행하고, 결과를 프론트 버그·API 에러·응답 스키마 불일치로 분류한다(2단계). "/qa-pr-run", "시나리오 실행해줘", "QA 자동으로 돌려줘" 요청 시 사용
disable-model-invocation: true
argument-hint: "[base ref] (없으면 origin/main)"
allowed-tools:
  - Bash(node .claude/skills/qa-pr/scripts/match-spec-docs.mjs*)
  - Bash(git diff*)
  - Bash(git log*)
  - Bash(QA_PR_RUN=1 pnpm exec playwright test e2e/.generated*)
  - Bash(mkdir -p e2e/.generated*)
  - Read
  - Write(e2e/.generated/**)
  - Grep
  - Glob
---

# PR QA 시나리오 실행 (2단계 — 코드 생성 + 로컬 실행 + 분류)

목표: `/qa-pr`이 만드는 시나리오를 실제로 **한 번 돌려서** 결과를 프론트 버그 / API 에러 / 응답 스키마 불일치로 나눠 리포트한다. 이것도 머지 게이트가 아니라 참고 리포트다.

- 생성한 스펙 파일은 `e2e/.generated/`에 둔다 (gitignore, `pnpm test:e2e` 기본 실행 대상 아님 — `playwright.config.ts`의 `testIgnore` 참고)
- 가치 있는 시나리오는 이 스킬이 아니라 **사람이** `e2e/`로 승격한다
- 환경 제약·모킹 정책은 `.claude/skills/qa-pr/references/qa-policy.md`를 반드시 먼저 읽고 따른다

## Phase 1~3: 매칭 · 스펙 대조 · 시나리오 작성

`.claude/skills/qa-pr/SKILL.md`의 Phase 1(스크립트로 diff↔스펙 매칭), Phase 2(스펙 대조), Phase 3(시나리오 작성 — "하지 않는 것" 포함)를 **그대로** 따른다. 이 스킬은 그 산출물(시나리오 목록)을 코드로 바꾸고 실행하는 것만 추가한다.

- 시나리오 하나가 검증할 "기대 결과"가 스펙·코드에 명확한 문구·상태로 없으면 Phase 4에서 자동 검증 대상에서 뺀다 (지어내지 않는다는 원칙은 여기서도 유효)

## Phase 4: Playwright 코드 생성

`.claude/skills/create-e2e/SKILL.md`의 패턴(역할 기반 locator, web-first assertion, `/test-auth` 로그인)을 그대로 쓴다. 기존 `e2e/group-manage.spec.ts`가 참고할 만한 예시다.

```bash
mkdir -p e2e/.generated
```

문서(스펙) 하나당 파일 하나: `e2e/.generated/<스펙-슬러그>.spec.ts` (예: `groups.md` → `e2e/.generated/groups.spec.ts`)

각 파일 구조:

```typescript
import { expect, type Page, test } from '@playwright/test';

const login = async (page: Page) => {
  await page.goto('/test-auth');
  await page.getByLabel('Email').fill('test@test.com');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForURL('/');
};

test.describe('<스펙 문서 제목> — QA 자동 생성', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // qa-policy.md 기준: 실제 데이터를 바꾸는 요청은 page.route로 모킹
  });

  test('<시나리오 제목>', async ({ page }) => {
    const apiErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on('response', (res) => {
      if (res.status() >= 400) apiErrors.push(`${res.status()} ${res.request().method()} ${res.url()}`);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // --- 단계 ---
    // 시나리오의 "단계"를 그대로 코드로

    // --- 기대 결과 (스펙·코드에 명확한 것만) ---
    // await expect(...).toBeVisible();

    if (apiErrors.length) await test.info().attach('api-errors', { body: apiErrors.join('\n') });
    if (consoleErrors.length) await test.info().attach('console-errors', { body: consoleErrors.join('\n') });
  });
});
```

- `apiErrors`/`consoleErrors` 수집은 **모든 생성 테스트에 빠짐없이** 넣는다 — Phase 6 분류의 유일한 근거다
- qa-policy.md의 "실제 데이터를 바꾸는 요청은 모킹" 원칙에 따라 작성·수정·삭제·참여·장착류 요청은 `page.route('**/api/proxy/...', …)`로 응답을 고정한다. 그 요청은 의도적으로 모킹한 것이므로 `apiErrors`에 잡혀도 분류에서 제외한다(아래 Phase 6 참고)
- 기대 결과를 자동으로 단언할 수 없는 시나리오는 코드로 옮기지 않고 `test.fixme('<제목> — 사람 확인 필요: <이유>')`만 남긴다

## Phase 5: 실행

```bash
QA_PR_RUN=1 pnpm exec playwright test e2e/.generated --reporter=json > e2e/.generated/results.json
```

- `QA_PR_RUN=1` 필수 — `playwright.config.ts`의 `testIgnore`가 `e2e/.generated`를 기본 제외하는데, **CLI로 경로를 직접 지정해도 이 설정이 우선 적용돼서 빠짐**. 이 환경변수로만 해제된다 (빠뜨리면 테스트 0개 실행되고 조용히 끝남 — 실행 전 `stats.expected`가 0이 아닌지 확인)
- 실패해도(exit code != 0) 이 명령 자체는 다음 단계로 넘어간다 — 실패가 곧 리포트 대상이다
- 타임아웃이나 dev 서버 기동 실패 등 Phase 5 자체가 안 돌아가면 그 사실만 보고하고 중단한다 (억지로 재시도하지 않는다)

> CI(`.github/workflows/qa-pr.yml`)에서는 Phase 6~7이 AI 없이
> `scripts/report-and-comment.mjs`로 결정적으로 실행되고 PR에 코멘트까지 단다. 로컬에서 사람이
> `/qa-pr-run`을 돌릴 때는 아래처럼 직접 읽고 분류·리포트한다.

## Phase 6: 결과 분류

`e2e/.generated/results.json`을 읽어 실패한 테스트마다 `api-errors`/`console-errors` attachment를 확인해 아래 우선순위로 분류한다.

| 분류 | 판단 기준 |
|---|---|
| **API 에러 (4xx·5xx)** | `api-errors`에 **의도적으로 모킹하지 않은** 엔드포인트의 4xx·5xx가 있다 |
| **응답 스키마 불일치** | `console-errors`에 Zod/파싱 관련 에러(`ZodError`, `parse`, `Expected`, `Invalid` 등)가 있다 |
| **프론트 버그** | 위 둘 다 없이 assertion만 실패했다 (UI가 기대 결과대로 안 움직임) |
| **불확실** | 근거가 애매하거나(네트워크 지연, selector 자체 오류 등) 위 셋으로 못 정한다 — 사람이 직접 봐야 함을 명시 |

통과한 테스트는 리포트에 "정상 확인됨"으로 한 줄만 남긴다.

## Phase 7: 리포트

`.claude/skills/qa-pr/SKILL.md` Phase 4의 리포트 형식을 확장한다 — "영향 범위"·"스펙 대조"·"사람 확인 체크리스트" 섹션은 그대로 쓰고, "QA 시나리오" 섹션 대신 아래를 넣는다. 분량 목표도 동일하게 화면 한 장(60줄 안팎), 넘치면 실패한 것 위주로 남긴다.

```text
## 실행 결과
- 총 N개 / 통과 N개 / 실패 N개 / 사람 확인 필요(fixme) N개

### 실패
1. <시나리오 제목> — **<분류>**
   - 근거: <api-errors 또는 console-errors 요약, 또는 assertion 실패 메시지 한 줄>
   - 파일: `e2e/.generated/<파일>.spec.ts`
```

## 하지 않는 것

- 실패를 자동으로 고치거나 재시도하지 않는다 — 리포트만 한다
- `e2e/.generated/`의 파일을 커밋하거나 `e2e/`로 옮기지 않는다 — 승격은 사람이 판단

## CI (3단계, 구현됨)

`.github/workflows/qa-pr.yml` — main 대상 PR이 열리거나 갱신되면(`pull_request`) 자동 실행한다. 특정 PR을 다시 돌릴 때는 `workflow_dispatch`로 PR 번호를 넘겨 수동 실행한다.

- Claude는 Phase 1~4(코드 생성)만 하고, `--allowedTools`로 `Bash(gh:*)` 등 GitHub 쓰기 수단을 아예 차단한다
- 실행(Phase 5)·분류·코멘트(Phase 6~7)는 `scripts/report-and-comment.mjs`가 AI 없이 결정적으로 한다
- PR 본문·충돌 상태는 Claude 실행 전에 스크립트가 `e2e/.generated/pr.json`으로 저장한다 (Claude는 `gh`를 못 쓴다)
- PR 코멘트는 `<!-- qa-pr-run-report -->` 마커로 찾아 갱신한다(PR당 1개). main과 충돌 중이면 맨 위에 경고를 붙인다
- 인증은 `CLAUDE_CODE_OAUTH_TOKEN`(Claude 구독) — 로컬에서 `claude setup-token`으로 발급해 레포 시크릿에 등록해야 동작한다
