import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// e2e 테스트 설정. 실행: pnpm test:e2e
export default defineConfig({
  testDir: './e2e',
  // qa-pr-run이 생성하는 임시 시나리오는 pnpm test:e2e 기본 실행 대상이 아니다.
  // testIgnore는 명시적으로 경로를 지정해도 무조건 적용되므로, qa-pr-run 실행 시엔 QA_PR_RUN=1로 해제한다.
  testIgnore: process.env.QA_PR_RUN ? undefined : '**/.generated/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // 테스트 시작 시 dev 서버를 자동으로 띄운다 (이미 떠 있으면 재사용)
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
