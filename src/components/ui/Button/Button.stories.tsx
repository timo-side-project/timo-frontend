import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import Button from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    label: '기록 완료',
    variant: 'primary',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    label: '보조 버튼',
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    label: '비활성',
    disabled: true,
  },
};

// 인터랙션 테스트: 클릭하면 onClick이 호출된다
export const Clickable: Story = {
  args: {
    label: '클릭',
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: '클릭' });

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
