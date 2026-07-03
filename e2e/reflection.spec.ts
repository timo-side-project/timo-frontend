import { expect, test } from '@playwright/test';

test.describe('회고 작성', () => {
  test('오늘의 질문에 답하고 기록을 완료하면 피드백 화면으로 이동한다', async ({
    page,
  }) => {
    await page.route('**/api/proxy/reflections/today/question', (route) =>
      route.fulfill({
        json: {
          id: 1,
          category: 'DAILY',
          content: '오늘 가장 기억에 남는 순간은 무엇인가요?',
          sequence: 1,
          createdBy: 'system',
          createdAt: new Date().toISOString(),
        },
      }),
    );
    await page.route('**/api/proxy/reflections', (route) =>
      route.fulfill({ json: { id: 55 } }),
    );
    await page.route('**/api/proxy/reflections/55/feedback', (route) =>
      route.fulfill({
        json: {
          id: 1,
          reflectionId: 55,
          content: '오늘도 좋은 회고였어요.',
          status: 'DONE',
          score: 80,
          createdAt: new Date().toISOString(),
          failureReason: null,
        },
      }),
    );

    await page.goto('/reflection');

    await expect(
      page.getByText('오늘 가장 기억에 남는 순간은 무엇인가요?'),
    ).toBeVisible();

    await page
      .getByPlaceholder('오늘 기억에 남는 순간과 그때의 감정을 적어보세요.')
      .fill('오늘은 팀원들과 회고를 잘 마무리했다.');

    await page.getByRole('button', { name: '기록 완료' }).click();

    await expect(page).toHaveURL(/\/reflection\/55\/feedback/);
    await expect(page.getByText('기록이 완료되었어요.')).toBeVisible();
  });
});
