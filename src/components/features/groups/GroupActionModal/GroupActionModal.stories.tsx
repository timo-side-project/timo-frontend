import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import GroupActionModal from './GroupActionModal';

const meta = {
  title: 'Features/Groups/GroupActionModal',
  component: GroupActionModal,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onConfirm: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof GroupActionModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Delete: Story = {
  args: {
    title: '그룹 삭제하기',
    description: '어떤 친구 모임을 삭제하시겠습니까?',
    confirmLabel: '삭제하기',
    cancelLabel: '취소하기',
  },
};

export const Leave: Story = {
  args: {
    title: '그룹 나가기',
    description: '어떤 친구 모임을 나가시겠습니까?',
    confirmLabel: '나가기',
    cancelLabel: '취소하기',
  },
};

// cancelLabel을 넘기지 않으면 확인 버튼만 있는 안내용 모달이 된다
export const EditComplete: Story = {
  args: {
    title: '그룹 수정 완료',
    description: '어떤 친구 모임의 그룹 수정이 완료되었습니다',
    confirmLabel: '완료',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    expect(canvas.getByRole('button', { name: '완료' })).toBeInTheDocument();
    expect(canvas.queryByRole('button', { name: '취소하기' })).toBeNull();
  },
};

export const Pending: Story = {
  args: {
    title: '그룹 삭제하기',
    description: '어떤 친구 모임을 삭제하시겠습니까?',
    confirmLabel: '삭제하기',
    cancelLabel: '취소하기',
    isPending: true,
  },
};

// 확인을 누르면 onConfirm이, 취소를 누르면 onClose가 불린다
export const ConfirmAndCancel: Story = {
  args: {
    title: '그룹 삭제하기',
    description: '어떤 친구 모임을 삭제하시겠습니까?',
    confirmLabel: '삭제하기',
    cancelLabel: '취소하기',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: '삭제하기' }));
    expect(args.onConfirm).toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: '취소하기' }));
    expect(args.onClose).toHaveBeenCalled();
  },
};
