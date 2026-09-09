import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import CommentItem from './CommentItem';

const meta = {
  title: 'Features/Groups/ReflectionEngagement/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-g-600 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    comment: {
      id: 1,
      commenterId: 10,
      commenterNickname: 'Sora furu',
      commenterCategory: 'PAST_POSITIVE',
      content: 'Leon님 오늘의 생각이 너무 멋있어요!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
  },
};

export const Mine: Story = {
  args: {
    comment: {
      id: 2,
      commenterId: 7,
      commenterNickname: '나',
      commenterCategory: 'PRESENT_FATALISTIC',
      content: '재밌게 잘살고 있네...',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    isMine: true,
    onEditStart: () => {},
    onDelete: () => {},
  },
};

export const Editing: Story = {
  args: {
    comment: {
      id: 3,
      commenterId: 7,
      commenterNickname: '나',
      commenterCategory: 'PRESENT_FATALISTIC',
      content: '재밌게 잘살고 있네...',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    isMine: true,
    isEditing: true,
    onEditSubmit: () => {},
    onEditCancel: () => {},
  },
};
