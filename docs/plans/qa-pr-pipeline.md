# PR 단위 AI QA 보조 파이프라인 — 작업 계획

> **임시 문서.** 구현이 끝나면 삭제하거나 `.claude/skills/qa-pr/` 스킬 문서로 옮긴다. 규칙 문서가 아니므로 AGENTS.md에 등록하지 않는다.

## 1. 목표

AI가 QA를 대체하는 게 아니라, **"이번 PR에서 사람이 어디를 확인해야 하는지"를 좁혀주고 1차 확인까지 해주는 도구**를 만든다.

- 결과는 머지 게이트가 아니라 **참고 리포트**다
- 흐름: PR diff → 영향받는 기능·화면 파악 → 시나리오 3~5개 생성 → Playwright 실행 → PR에 결과 코멘트

## 2. 지금까지 한 것 (`chore/ai-pr-qa-agent` 브랜치)

| 커밋 | 내용 |
|---|---|
| `docs: 제품 스펙 문서 추가 및 동기화 스킬 반영` | `docs/product.md` (개요·용어) |
| `docs: 기능별 상세 스펙 문서 추가` | `docs/product/` 8개 문서 (기능별 규칙·예외·확인 필요) |
| `docs: 기능 스펙 문서 갱신 규칙 추가` | conventions 규칙 + code-review / create-pr / sync-docs 스킬 반영 |
| `feat: PR diff와 기능 스펙 매칭하는 qa-pr 스킬 추가` | `.claude/skills/qa-pr/` — 1단계 완료 (아래 4번 참고) |

> `chore/ai-pr-qa-agent-jyj` 브랜치에서 같은 base로 독자적으로 `qa-pr` 스킬을 만듦(`qa-policy.md`, Phase별 구조, frontmatter 제한). 겹치는 부분 검토해서 좋은 것만 이 브랜치에 반영함 — **두 브랜치가 아직 별도로 존재하니 main에 PR 올리기 전에 조율 필요**.

### 스펙 문서 구조

```text
docs/product.md                  개요·용어·문서 목록
docs/product/
  auth-onboarding.md             인증 가드, 온보딩, 로그인, 하단 탭바, 앱 설치 안내
  ztpi.md                        ZTPI 테스트, 결과, 캐릭터 소개
  reflection.md                  홈, 회고 작성·상세, AI 피드백, 서비스 피드백
  groups.md                      그룹, 랭킹, 친구 회고, 좋아요·댓글
  calendar.md / statistics.md / reward.md / profile.md
```

각 문서는 같은 형식을 따른다.

- frontmatter `sources`(담당 코드 경로 glob) / `routes`(URL)
- 본문: **규칙 → 예외 → 확인 필요 — 버그 의심**
- 코드에서 추론했고 기획 의도가 확정되지 않은 규칙은 `[확인 필요]`

## 3. 결정한 것과 이유

| 결정 | 이유 |
|---|---|
| 스펙은 스킬 안이 아니라 `docs/product/`에 둔다 | 리뷰·기능 개발에서도 참고 가능 |
| 스펙은 **기능(도메인) 단위**로 나눈다 (페이지 단위 X) | 규칙 하나가 여러 페이지에 걸침. PR diff도 기능 폴더 단위로 나옴 |
| frontmatter `sources` glob으로 diff ↔ 문서를 연결한다 | 읽을 문서를 AI가 아니라 스크립트가 결정적으로 고름 |
| 스펙 문서는 **QA 기준 문서**다. 개발할 때 매번 읽게 하지 않는다 | 스펙에 "버그 의심"도 적혀 있어 AI가 버그를 규칙으로 오해할 위험. 대조는 PR 시점(code-review)에만 |
| 동작을 바꾸면 **같은 PR에서 스펙을 갱신**한다 (conventions 규칙) | 갱신 안 되면 QA가 낡은 스펙으로 시나리오를 만듦 |
| 스펙 불일치는 리뷰 실패로 막지 않고 **리포트만** 한다 | 스펙 자체가 틀렸을 수 있음(`[확인 필요]` 다수) |
| 시나리오는 Playwright MCP 탐색이 아니라 **Playwright 코드로 생성**해서 실행 | 재현성. 가치 있는 시나리오는 사람이 `e2e/`로 승격 |
| 첫 실행 환경은 Vercel Preview가 아니라 **CI에서 `pnpm dev`** | 아래 "코드베이스 제약" 참고 — Preview는 인증이 막힘 |

## 4. 단계별 계획

**원칙:** 각 단계는 PR 하나. 앞 단계가 쓸 만한지 확인하고 다음으로 간다.

### 1단계. `/qa-pr` 로컬 스킬 — 시나리오 목록만 출력 — ✅ 완료

- 입력: 현재 브랜치 diff (`git diff origin/main...HEAD`, base ref는 인자로 override 가능)
- 매칭은 AI가 아니라 `.claude/skills/qa-pr/scripts/match-spec-docs.mjs`가 결정적으로 계산 (glob → RegExp)
- 파일을 4가지로 분류: **스펙 매칭** / **전역 영향**(`ui`·`hooks`·`lib`·`layout`·설정 파일) / **QA 대상 아님**(`docs/**`·`.claude/**`·`e2e/**`·`*.stories.tsx`·`public/**`, spec 매칭보다 우선) / **스펙 없음**
- 스펙의 규칙·예외 + diff로 **시나리오 3~5개**, 스펙과의 대조(스펙 갱신 필요 / 스펙과 다른 변경 / 해소된 확인 필요), **사람 확인 체크리스트**(버그 의심 항목 포함, 검증은 안 함) 출력. 리포트 분량은 60줄 안팎으로 제한
- 환경 제약·모킹 정책은 `.claude/skills/qa-pr/references/qa-policy.md`로 분리
- **완료 기준 검증:** 과거 실제 PR 3개(#27 그룹 관리, #29 통계 그래프, #17 테마 잠금) 격리 diff로 돌려봄. 노이즈 적고, 스펙의 "버그 의심" 항목이 매번 해당 PR 핵심 변경과 실제로 겹침 → 통과로 판단
- **남은 것:** 팀원 리뷰는 아직 안 함(지금까진 1인 판단). jyj 브랜치와 조율 전이라 main PR은 아직

### 2단계. Playwright 코드 생성 + 로컬 실행

- 시나리오를 `e2e/.generated/*.spec.ts`로 생성 (gitignore)
- 기존 `create-e2e` 스킬 패턴 재사용 (`/test-auth` 로그인, role 기반 locator)
- 실행 결과를 **프론트 버그 / API 에러(4xx·5xx) / 응답 스키마 불일치** 3가지로 분류

### 3단계. CI 워크플로 + PR 코멘트

- `pull_request` 트리거, CI에서 `pnpm dev` 띄워 실행
- AI는 스펙 생성까지만, **실행·분류·코멘트 작성은 스크립트**가 담당 (AI에 GitHub 쓰기 권한 불필요)
- 코멘트는 PR당 1개를 갱신 (push마다 새 코멘트 X)
- fork PR 실행 금지, 경로 필터, `concurrency`로 중복 실행 취소, `--max-turns`·타임아웃으로 비용 상한

### 4단계 (필요성 확인 후). import 그래프로 공용 파일 영향 계산

### 5단계 (필요성 확인 후). Vercel Preview 대상 실행

## 5. 결정된 것 / 아직 남은 것

- [x] **스펙 신뢰도 표시:** `status` 필드는 보류. 지금은 모든 스펙을 draft(현재 코드 동작 기준)로 간주 — 검토된 문서가 생기면 그때 다시 논의
- [x] **"버그 의심"·`[확인 필요]` 처리 정책:** 시나리오로 검증하지 않고 `⚠️` 표시로 "사람 확인 체크리스트"에만 넣는다
- [x] **QA 환경 제약 위치:** `.claude/skills/qa-pr/references/qa-policy.md` (테스트 계정, 모킹 정책, 방해 조건, 모바일 뷰포트, "AI가 확인 못 하는 것" 포함)
- [x] **1단계 스킬 frontmatter:** `disable-model-invocation: true`(슬래시 커맨드로만 실행) + `allowed-tools`에서 Edit/Write 제외(리포트만, 파일 수정 없음) + `argument-hint: "[base ref]"`
- [ ] **작업 이슈·브랜치:** 아직 `chore/ai-pr-qa-agent`. 컨벤션(`feature/{이름}-#{이슈번호}`) 아님 — main PR 올리기 전에 정리할지 결정 필요
- [ ] 스펙 `[확인 필요]` 항목을 누가 기획·백엔드에 확인할지
- [ ] **jyj 브랜치 조율:** 같은 스킬을 독자적으로 만든 `chore/ai-pr-qa-agent-jyj`와 어느 쪽을 기준으로 머지할지

## 6. 코드베이스 제약 (계획에 영향 주는 사실)

- **경로:** 라우트는 루트 `app/` (`src/app` 아님), e2e는 루트 `e2e/` (`tests/e2e` 아님)
- **`playwright.config.ts`:** `baseURL`이 `localhost:3000` 고정, `webServer: pnpm dev` 항상 실행 → 외부 URL 대상 실행하려면 분기 필요
- **API 호출 경로가 환경마다 다름** (`src/lib/config/env.ts`)
  - dev: 브라우저 → `/api/proxy` → 백엔드 (쿠키 도메인 제거)
  - production(Vercel Preview 포함): 브라우저 → `api.timo.io.kr` 직접, `/api/proxy`는 404
- **Preview에서 인증이 사실상 안 됨:** 로그인 쿠키가 `api.timo.io.kr` 쪽에 붙어서 `*.vercel.app` 요청에 실리지 않음 → 미들웨어(`proxy.ts`)가 항상 `/onboarding`으로 보냄
- **기존 e2e 모킹은 dev 전용:** `page.route('**/api/proxy/...')` 패턴이라 Preview에서는 하나도 안 걸림
- **SSR 요청은 모킹 불가:** 홈의 `/users/me`, 온보딩 소개 prefetch 등 서버 컴포넌트 요청은 `page.route`로 못 막음
- 기존 CI(`ci.yaml`)는 Playwright chromium을 설치하지만 e2e는 실행하지 않음

## 7. Claude Code 스킬 참고 (공식 문서 기준)

- `allowed-tools`는 **제한이 아니라 사전 승인**이다. 도구를 막으려면 `disallowed-tools`나 permissions `deny`
- `context: fork`는 격리된 subagent로 실행되며 **기본이 백그라운드**다. CI에서 결과를 기다리려면 `background: false`
- `` !`명령` `` 주입은 명령이 실패하면 **스킬 전체가 중단**된다 → diff 스크립트는 "변경 없음"에도 exit 0
- 로컬에서 자동 발동을 막으려면 `disable-model-invocation: true`
- GitHub Actions(`claude-code-action`)는 bot이 트리거한 실행을 거부한다 → Preview의 `deployment_status`(Vercel bot) 트리거를 쓰려면 `allowed_bots` 필요

## 8. 외부 확인 필요

- ⚠️ **`/test-auth`가 운영 환경에서도 열려 있음** (`testAuth/util/guards.ts`의 임시 허용 설정). 백엔드가 이메일만으로 로그인을 허용하는지 확인 필요
- 백엔드: `*.vercel.app` origin CORS 허용 여부, 쿠키 Domain 속성, 날짜 기준 시간대(`reflectedAt`이 한국 시간인지)
- Vercel: Deployment Protection 설정, Preview 커스텀 도메인 가능 여부
- `feature/friend-reflection-calendar-#31` 머지 시 `docs/product/groups.md` 친구 회고 부분 갱신 필요
