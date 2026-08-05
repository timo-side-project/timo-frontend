import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ResultCard from './ResultCard';

const SAMPLE_FEEDBACK =
  '어려움 속에서도 도전을 이어가셨던 경험이 있으셨군요. 그 과정에서 조금씩 어려움을 극복해나가셨다는 점이 인상 깊어요. 앞으로도 긍정적인 마음으로 나아가시길 응원해요.';

const meta = {
  title: 'Features/ReflectionFeedback/ResultCard',
  component: ResultCard,
  parameters: {
    layout: 'centered',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-90">
        <Story />
      </div>
    ),
  ],
  args: {
    feedback: SAMPLE_FEEDBACK,
    category: 'PAST_NEGATIVE',
    changedScore: 0.1666666,
    isIncreased: true,
    streakDays: 3,
  },
} satisfies Meta<typeof ResultCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstReflection: Story = {
  args: {
    streakDays: 1,
  },
};

export const Streak: Story = {
  args: {
    streakDays: 7,
  },
};

export const PastPositive: Story = {
  args: {
    category: 'PAST_POSITIVE',
  },
};

export const Future: Story = {
  args: {
    category: 'FUTURE',
  },
};

export const Decreased: Story = {
  args: {
    isIncreased: false,
  },
};

export const MinimalChange: Story = {
  args: {
    changedScore: 0.03,
  },
};

export const NoChange: Story = {
  args: {
    changedScore: 0,
  },
};

export const LongFeedback: Story = {
  args: {
    feedback: SAMPLE_FEEDBACK.repeat(4),
  },
};
