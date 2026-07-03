import { expect, test } from '@playwright/test';

test.describe('그룹 참여', () => {
  test('친구 코드를 입력하면 그룹에 참여한다', async ({ page }) => {
    await page.route('**/api/proxy/groups', (route) =>
      route.fulfill({ json: [] }),
    );
    await page.route('**/api/proxy/groups/members**', (route) =>
      route.fulfill({ status: 200, json: {} }),
    );

    await page.goto('/groups?join=friend');

    await page.getByPlaceholder('코드를 입력하세요').fill('ABCD1234');
    await page.getByRole('button', { name: '입력하기' }).click();

    await expect(page).toHaveURL(/\/groups$/);
    await expect(page.getByText('그룹에 참여했어요.')).toBeVisible();
  });
});
