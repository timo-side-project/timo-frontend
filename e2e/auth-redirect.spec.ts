import { expect, test } from '@playwright/test';

// 미들웨어(proxy.ts) 인증 가드 검증
test.describe('인증 리다이렉트', () => {
  test('비로그인 상태로 홈(/) 접근 시 온보딩으로 리다이렉트', async ({
    page,
  }) => {
    // 쿠키 없음(비로그인) → 미들웨어가 /onboarding 으로 보냄
    await page.goto('/');

    await expect(page).toHaveURL(/\/onboarding/);
  });
});
