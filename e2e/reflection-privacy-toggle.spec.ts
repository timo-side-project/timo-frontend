import { expect, type Page, test } from '@playwright/test';

const GROUP_ID = 1;
const REFLECTION_ID = 10;

const buildReflectionDetail = (overrides: Record<string, unknown> = {}) => ({
  id: REFLECTION_ID,
  question: {
    id: 1,
    sequence: 1,
    category: 'PRESENT_HEDONISTIC',
    content: '오늘 하루 중 가장 기억에 남는 순간은 무엇인가요?',
    createdBy: 'system',
    createdAt: new Date().toISOString(),
  },
  content: '팀원들과 함께 회고를 잘 마무리했다.',
  reflectedAt: '2026-08-10',
  likes: 3,
  comments: 0,
  isLiked: false,
  nickname: '나',
  isMine: true,
  isPublic: true,
  ...overrides,
});

const login = async (page: Page) => {
  // '/groups/...'는 미들웨어(proxy.ts matcher)가 access_token 쿠키를 요구하므로 실제 로그인 후 진행
  await page.goto('/test-auth');
  await page.getByLabel('Email').fill('test@test.com');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForURL('/');
};

test.describe('회고 공개/비공개 토글', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    await page.route(
      `**/api/proxy/groups/${GROUP_ID}/reflections/${REFLECTION_ID}/comments`,
      (route) => route.fulfill({ json: [] }),
    );
  });

  test('내 회고는 공개 상태로 진입해 비공개로 전환할 수 있다', async ({
    page,
  }) => {
    await page.route(
      `**/api/proxy/groups/${GROUP_ID}/reflections/${REFLECTION_ID}`,
      (route) => route.fulfill({ json: buildReflectionDetail() }),
    );
    await page.route(
      `**/api/proxy/groups/${GROUP_ID}/reflections/${REFLECTION_ID}/private`,
      (route) => {
        expect(route.request().method()).toBe('POST');
        return route.fulfill({ status: 201, body: '' });
      },
    );

    await page.goto(`/groups/${GROUP_ID}/reflections/${REFLECTION_ID}`);

    await expect(
      page.getByRole('heading', { name: '나의 회고' }),
    ).toBeVisible();
    await expect(
      page.getByText('오늘 하루 중 가장 기억에 남는 순간은 무엇인가요?'),
    ).toBeVisible();

    const toggleButton = page.getByRole('img', { name: '공개' });
    await expect(toggleButton).toBeVisible();

    const requestPromise = page.waitForRequest(
      (request) =>
        request
          .url()
          .includes(
            `/api/proxy/groups/${GROUP_ID}/reflections/${REFLECTION_ID}/private`,
          ) && request.method() === 'POST',
    );

    await toggleButton.click();
    await requestPromise;

    await expect(page.getByRole('img', { name: '비공개' })).toBeVisible();
  });

  test('비공개 회고를 다시 공개로 전환할 수 있다', async ({ page }) => {
    await page.route(
      `**/api/proxy/groups/${GROUP_ID}/reflections/${REFLECTION_ID}`,
      (route) =>
        route.fulfill({ json: buildReflectionDetail({ isPublic: false }) }),
    );
    await page.route(
      `**/api/proxy/groups/${GROUP_ID}/reflections/${REFLECTION_ID}/private`,
      (route) => {
        expect(route.request().method()).toBe('DELETE');
        return route.fulfill({ status: 204, body: '' });
      },
    );

    await page.goto(`/groups/${GROUP_ID}/reflections/${REFLECTION_ID}`);

    const toggleButton = page.getByRole('img', { name: '비공개' });
    await expect(toggleButton).toBeVisible();

    const requestPromise = page.waitForRequest(
      (request) =>
        request
          .url()
          .includes(
            `/api/proxy/groups/${GROUP_ID}/reflections/${REFLECTION_ID}/private`,
          ) && request.method() === 'DELETE',
    );

    await toggleButton.click();
    await requestPromise;

    await expect(page.getByRole('img', { name: '공개' })).toBeVisible();
  });

  test('내 회고가 아니면 공개/비공개 버튼이 보이지 않는다', async ({
    page,
  }) => {
    await page.route(
      `**/api/proxy/groups/${GROUP_ID}/reflections/${REFLECTION_ID}`,
      (route) =>
        route.fulfill({
          json: buildReflectionDetail({ isMine: false, nickname: '지민' }),
        }),
    );

    await page.goto(`/groups/${GROUP_ID}/reflections/${REFLECTION_ID}`);

    await expect(
      page.getByRole('heading', { name: '친구 회고' }),
    ).toBeVisible();
    await expect(
      page.getByText('오늘 하루 중 가장 기억에 남는 순간은 무엇인가요?'),
    ).toBeVisible();

    await expect(page.getByRole('img', { name: '공개' })).toHaveCount(0);
    await expect(page.getByRole('img', { name: '비공개' })).toHaveCount(0);
  });
});
