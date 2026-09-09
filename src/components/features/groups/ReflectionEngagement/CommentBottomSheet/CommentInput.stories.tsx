import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import CommentInput from './CommentInput';

const meta = {
  title: 'Features/Groups/ReflectionEngagement/CommentInput',
  component: CommentInput,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  args: {
    placeholder: '댓글을 입력해주세요',
    onChange: () => {},
    onSubmit: () => {},
  },
  decorators: [
    (Story) => (
      <div className="bg-g-600 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    value: '',
  },
};

export const Filled: Story = {
  args: {
    value: '재밌게 잘살고 있네...',
  },
};

export const Interactive: Story = {
  args: {
    value: '',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return <CommentInput {...args} value={value} onChange={setValue} />;
  },
};
