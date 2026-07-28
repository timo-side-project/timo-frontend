import { expect, test } from '@playwright/test';

test.describe('테마 선택', () => {
  test('테마를 선택하고 저장하면 적용 완료 모달을 거쳐 홈으로 이동한다', async ({
    page,
  }) => {
    // '/'는 미들웨어(proxy.ts matcher)가 access_token 쿠키를 요구하므로 실제 로그인 후 진행
    await page.goto('/test-auth');
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.waitForURL('/');

    await page.route('**/api/proxy/users/me', (route) =>
      route.fulfill({
        json: {
          id: 1,
          email: 'test@test.com',
          name: '테스트',
          provider: 'google',
          category: 'PRESENT_HEDONISTIC',
          streakDays: 3,
          isOnboarded: true,
          createdAt: new Date().toISOString(),
          equippedCustomizations: [],
        },
      }),
    );

    await page.route('**/api/proxy/customizations', (route) =>
      route.fulfill({
        json: [
          {
            id: 1,
            name: '테마 1',
            type: 'THEME',
            image: '/images/theme-1.png',
            imageWithoutBackground: null,
            isUnlocked: true,
            isEquipped: true,
          },
          {
            id: 2,
            name: '테마 2',
            type: 'THEME',
            image: '/images/theme-2.png',
            imageWithoutBackground: null,
            isUnlocked: true,
            isEquipped: false,
          },
          {
            id: 3,
            name: '펫 1',
            type: 'DECORATION',
            image: '/images/pet-1.png',
            imageWithoutBackground: null,
            isUnlocked: true,
            isEquipped: false,
          },
        ],
      }),
    );

    await page.route('**/api/proxy/customizations/2/equip', (route) =>
      route.fulfill({ status: 200, json: {} }),
    );

    await page.goto('/profile/theme');

    await expect(
      page.getByRole('heading', { name: '테마 선택하기' }),
    ).toBeVisible();

    await page.getByRole('button', { name: '테마 2' }).click();

    await page.getByRole('button', { name: 'right action' }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('나의 캐릭터 테마 적용 완료')).toBeVisible();

    await page.getByRole('button', { name: '보러가기' }).click();

    await expect(page).toHaveURL('/');
  });
});
