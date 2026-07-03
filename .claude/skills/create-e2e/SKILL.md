---
name: create-e2e
description: TIMO 프론트 e2e 테스트 작성 — @playwright/test로 전체 유저 플로우(라우트·인증·미들웨어)를 실제 브라우저에서 검증. "e2e 작성", "플로우 테스트", "playwright 테스트", "시나리오 테스트" 요청 시 사용
---

# TIMO e2e 테스트 (@playwright/test)

전체 앱을 실제 브라우저(chromium)로 띄워 유저 여정을 검증한다. 테스트는 `e2e/*.spec.ts`에 둔다.

**e2e는 핵심 여정만** 짠다 (온보딩→홈, 회고 작성, 그룹 참여, 인증 리다이렉트 등). 컴포넌트 단위 검증은 `create-test`(Storybook) 사용.

## 설정 (이미 되어 있음)

- `playwright.config.ts`: `testDir: './e2e'`, `baseURL: http://localhost:3000`, `webServer`가 `pnpm dev`를 자동 기동(떠 있으면 재사용)
- `playwright`와 `@playwright/test` **버전은 반드시 일치**시킨다 (다르면 `test.describe did not expect...` 에러)

## 패턴 (검증됨)

```typescript
import { expect, test } from '@playwright/test';

test.describe('인증 리다이렉트', () => {
  test('비로그인 상태로 홈(/) 접근 시 온보딩으로 리다이렉트', async ({ page }) => {
    await page.goto('/'); // baseURL 기준 상대 경로
    await expect(page).toHaveURL(/\/onboarding/);
  });
});
```

### 규칙
- 요소는 **역할/접근 이름**으로 찾는다: `page.getByRole('button', { name: '기록 완료' })`
- 단언은 web-first assertion(`await expect(locator).toBeVisible()` 등) — 자동 재시도됨
- 이동은 `page.goto('/경로')` (baseURL 상대)

### 로그인이 필요한 플로우
- 미들웨어(`proxy.ts`)는 `access_token` 쿠키로 인증한다. 로그인 상태가 필요하면 `context.addCookies([...])`로 토큰 쿠키를 주입하거나, `storageState`로 로그인 상태를 저장해 재사용한다
- 백엔드 의존이 크면 `page.route()`로 API 응답을 모킹한다

## Playwright MCP 활용

`.mcp.json`에 Playwright MCP가 등록돼 있다. **플로우를 라이브로 탐색·확인**(브라우저 조작·스냅샷)한 뒤, 그 단계를 이 `@playwright/test` 스펙으로 **굳힌다**. MCP는 탐색/디버깅용이고, 커밋되는 테스트는 spec 파일이다.

## 실행 & 검증

```bash
pnpm test:e2e          # 헤드리스 실행
pnpm test:e2e:ui       # UI 모드(디버깅)
pnpm exec playwright test e2e/auth-redirect.spec.ts   # 특정 파일
```

작성 후 반드시 `pnpm test:e2e`로 **실제 통과를 확인**한다.
