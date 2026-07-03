import { expect, test } from '@playwright/test';

// /test-auth로 실제 백엔드에 테스트 계정 로그인 후 인증 가드 통과 확인
test.describe('로그인 상태 가드', () => {
  test('인증된 유저는 홈에 정상 진입한다', async ({ page }) => {
    await page.goto('/test-auth');

    await page.getByLabel('Email').fill('test@test.com');
    await page.getByRole('button', { name: '로그인' }).click();

    await page.waitForURL('/');

    await expect(page).not.toHaveURL(/\/login/);
  });
});
