import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import WordRankingCard from './WordRankingCard';

const meta = {
  title: 'Features/Groups/WordRanking/WordRankingCard',
  component: WordRankingCard,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ul className="bg-g-500 flex gap-3 p-4">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof WordRankingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rank: 1,
    word: '무기력함',
    count: 64,
  },
};

export const ShortWord: Story = {
  args: {
    rank: 3,
    word: 'TIMO',
    count: 29,
  },
};

export const LongWord: Story = {
  args: {
    rank: 2,
    word: '아주아주긴단어입니다',
    count: 38,
  },
};
