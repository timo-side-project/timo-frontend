import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import RankingEmptyState from './RankingEmptyState';

const meta = {
  title: 'Features/Groups/Ranking/RankingEmptyState',
  component: RankingEmptyState,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RankingEmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Friend: Story = {
  args: { activeTab: 'FRIEND' },
};

export const Character: Story = {
  args: { activeTab: 'CHARACTER' },
};
