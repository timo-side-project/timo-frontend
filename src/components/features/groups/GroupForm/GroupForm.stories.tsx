import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import GroupForm from './GroupForm';

const meta = {
  title: 'Features/Groups/GroupForm',
  component: GroupForm,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  args: {
    name: '',
    onNameChange: fn(),
    imagePreview: null,
    onImageChange: fn(),
    onSubmit: fn(),
    submitLabel: '그룹 생성하기',
    isPending: false,
  },
} satisfies Meta<typeof GroupForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Create: Story = {};

// 수정 화면은 기존 이름과 대표 이미지가 채워진 채로 열린다
export const Edit: Story = {
  args: {
    name: '어떤 친구 모임',
    imagePreview: '/images/default-group.svg',
    submitLabel: '수정 완료하기',
  },
};

export const Pending: Story = {
  args: {
    name: '어떤 친구 모임',
    submitLabel: '수정 중...',
    isPending: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: '수정 중...' })).toBeDisabled();
  },
};

export const Typing: Story = {
  render: (args) => {
    const [name, setName] = useState('');

    return <GroupForm {...args} name={name} onNameChange={setName} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('그룹 이름');

    await userEvent.type(input, '새 모임');
    expect(input).toHaveValue('새 모임');
  },
};
