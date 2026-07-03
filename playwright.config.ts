import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// e2e 테스트 설정. 실행: pnpm test:e2e
export default defineConfig({
  testDir: './e2e',
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
