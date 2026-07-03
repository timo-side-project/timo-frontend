import { expect, test } from '@playwright/test';

test.describe('온보딩 → ZTPI 테스트 진입', () => {
  test('온보딩 캐러셀을 끝까지 진행하면 로그인 화면으로 이동한다', async ({
    page,
  }) => {
    // 온보딩 소개 콘텐츠는 공개 API라 실제 백엔드 응답을 그대로 사용한다.
    await page.goto('/onboarding');

    const nextButton = page.getByRole('button', { name: '다음' });
    await expect(nextButton).toBeVisible();

    for (let i = 0; i < 10 && !/\/login/.test(page.url()); i += 1) {
      await nextButton.click();
    }

    await expect(page).toHaveURL(/\/login/);
  });

  test('ZTPI 테스트 페이지 진입 시 테스트 문항이 노출된다', async ({
    page,
  }) => {
    await page.route('**/api/proxy/tests', (route) =>
      route.fulfill({
        json: [
          {
            id: 1,
            type: 'ZTPI_15',
            name: 'ZTPI-15',
            description: '',
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    );
    await page.route('**/api/proxy/test-records', (route) =>
      route.fulfill({ json: { id: 100, isExisting: false } }),
    );
    await page.route('**/api/proxy/tests/1/questions', (route) =>
      route.fulfill({
        json: [
          {
            id: 1,
            testId: 1,
            sequence: 1,
            content: '나는 미래를 위해 현재를 희생하는 편이다',
            isReversed: false,
            category: 'FUTURE',
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    );

    await page.goto('/ztpi-test');

    await expect(page.getByText('ZTPI 테스트')).toBeVisible();
    await expect(
      page.getByText('나는 미래를 위해 현재를 희생하는 편이다'),
    ).toBeVisible();
  });
});
