import { expect, type Page, test } from '@playwright/test';

const OWNER_GROUP = {
  id: 1,
  name: '어떤 친구 모임',
  type: 'FRIEND',
  image: null,
  category: null,
  memberCount: 3,
  myRole: 'OWNER',
  createdAt: new Date().toISOString(),
};

const login = async (page: Page) => {
  // '/groups'는 미들웨어(proxy.ts matcher)가 access_token 쿠키를 요구하므로 실제 로그인 후 진행
  await page.goto('/test-auth');
  await page.getByLabel('Email').fill('test@test.com');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForURL('/');
};

/** 그룹 썸네일을 길게 눌러 액션 메뉴를 연다 */
const longPressGroup = async (page: Page, name: string) => {
  const thumbnail = page.getByRole('button', { name }).first();
  const box = await thumbnail.boundingBox();
  if (!box) throw new Error('그룹 썸네일을 찾지 못했습니다');

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(700);
  await page.mouse.up();
};

test.describe('그룹 관리', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    await page.route('**/api/proxy/groups', (route) =>
      route.fulfill({ json: [OWNER_GROUP] }),
    );
    await page.route('**/api/proxy/groups/1/reflections/today**', (route) =>
      route.fulfill({ json: [] }),
    );
  });

  test('그룹 이름을 수정하면 완료 모달을 거쳐 목록으로 돌아온다', async ({
    page,
  }) => {
    let updatedName = '';
    await page.route('**/api/proxy/groups/1', async (route) => {
      updatedName = JSON.parse(route.request().postData() ?? '{}').name;
      await route.fulfill({ status: 204, body: '' });
    });

    await page.goto('/groups');
    await longPressGroup(page, '어떤 친구 모임');

    await page.getByRole('menuitem', { name: '그룹 수정하기' }).click();
    await expect(
      page.getByRole('heading', { name: '그룹 수정하기' }),
    ).toBeVisible();

    // 기존 이름이 채워진 채로 열린다
    const nameInput = page.getByLabel('그룹 이름');
    await expect(nameInput).toHaveValue('어떤 친구 모임');

    await nameInput.fill('새로운 모임');
    await page.getByRole('button', { name: '수정 완료하기' }).click();

    await expect(page.getByText('그룹 수정 완료')).toBeVisible();
    await page.getByRole('button', { name: '완료', exact: true }).click();

    await expect(page).toHaveURL(/\/groups$/);
    expect(updatedName).toBe('새로운 모임');
  });

  test('소유자가 그룹을 삭제하면 목록에서 사라진다', async ({ page }) => {
    let isDeleted = false;
    await page.route('**/api/proxy/groups', (route) =>
      route.fulfill({ json: isDeleted ? [] : [OWNER_GROUP] }),
    );
    await page.route('**/api/proxy/groups/1', async (route) => {
      isDeleted = true;
      await route.fulfill({ status: 204, body: '' });
    });

    await page.goto('/groups');
    await longPressGroup(page, '어떤 친구 모임');

    await page.getByRole('menuitem', { name: '그룹 삭제하기' }).click();
    await expect(
      page.getByText('어떤 친구 모임을 삭제하시겠습니까?'),
    ).toBeVisible();

    await page.getByRole('button', { name: '삭제하기' }).click();

    await expect(page.getByText('아직 참여 중인 그룹이 없어요')).toBeVisible();
  });

  test('캐릭터 그룹에서는 액션 메뉴가 열리지 않는다', async ({ page }) => {
    await page.route('**/api/proxy/groups', (route) =>
      route.fulfill({
        json: [
          {
            ...OWNER_GROUP,
            id: 2,
            name: '현재 쾌락 모임',
            type: 'CHARACTER',
            category: 'PRESENT_HEDONISTIC',
          },
        ],
      }),
    );
    await page.route('**/api/proxy/groups/2/reflections/today**', (route) =>
      route.fulfill({ json: [] }),
    );

    await page.goto('/groups');
    await page.getByRole('button', { name: '캐릭터' }).click();
    await longPressGroup(page, '현재 쾌락 모임');

    await expect(page.getByRole('menu')).toBeHidden();
  });
});
