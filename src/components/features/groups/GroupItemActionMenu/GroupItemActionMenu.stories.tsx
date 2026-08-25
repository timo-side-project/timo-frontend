import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test';

import GroupList from '../GroupList/GroupList';
import GroupItemActionMenu from './GroupItemActionMenu';

/** 길게 누른 썸네일 위치를 흉내 낸다 */
const anchorRect = new DOMRect(20, 96, 55, 55);

const groups = [
  { id: 1, name: '어떤 친구 모임', type: 'FRIEND' as const, image: null },
  { id: 2, name: '친구 모임', type: 'FRIEND' as const, image: null },
  { id: 3, name: '우리 모임', type: 'FRIEND' as const, image: null },
];

/** 길게 누르기가 끝날 때까지 기다린다 */
const waitForLongPress = () =>
  new Promise((resolve) => setTimeout(resolve, 700));

const meta = {
  title: 'Features/Groups/GroupItemActionMenu',
  component: GroupItemActionMenu,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  args: {
    anchorRect,
    onEdit: fn(),
    onDelete: fn(),
    onLeave: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof GroupItemActionMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Owner: Story = {
  args: { isOwner: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('menuitem', { name: '그룹 삭제하기' }),
    );
    expect(args.onDelete).toHaveBeenCalled();
  },
};

export const Member: Story = {
  args: { isOwner: false },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('menuitem', { name: '그룹 나가기' }),
    );
    expect(args.onLeave).toHaveBeenCalled();
  },
};

// 실제 화면처럼 그룹 목록 위에서 길게 눌러 메뉴를 연다
export const InGroupList: Story = {
  args: { isOwner: true },
  render: (args) => {
    const [pressedRect, setPressedRect] = useState<DOMRect | null>(null);

    return (
      <>
        <GroupList
          groups={groups}
          selectedId={1}
          onLongPress={(_, rect) => setPressedRect(rect)}
        />
        {pressedRect ? (
          <GroupItemActionMenu
            {...args}
            anchorRect={pressedRect}
            onClose={() => setPressedRect(null)}
          />
        ) : null}
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumbnail = canvas.getByRole('button', { name: /어떤 친구 모임/ });

    fireEvent.pointerDown(thumbnail, { clientX: 40, clientY: 100 });
    await waitForLongPress();
    fireEvent.pointerUp(thumbnail);

    await waitFor(() => expect(canvas.getByRole('menu')).toBeVisible());
  },
};

// 누른 채 옆으로 밀면 스크롤로 보고 메뉴를 열지 않는다
export const DragDoesNotOpen: Story = {
  args: { isOwner: true },
  render: InGroupList.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumbnail = canvas.getByRole('button', { name: /어떤 친구 모임/ });

    fireEvent.pointerDown(thumbnail, { clientX: 40, clientY: 100 });
    fireEvent.pointerMove(thumbnail, { clientX: 90, clientY: 100 });
    await waitForLongPress();
    fireEvent.pointerUp(thumbnail);

    expect(canvas.queryByRole('menu')).toBeNull();
  },
};

// 화면 오른쪽 끝에서 길게 눌러도 메뉴가 밖으로 밀려나지 않는다
export const NearRightEdge: Story = {
  args: {
    isOwner: true,
    anchorRect: new DOMRect(340, 96, 55, 55),
  },
};
