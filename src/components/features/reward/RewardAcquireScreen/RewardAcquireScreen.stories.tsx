import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import RewardAcquireScreen from './RewardAcquireScreen';

const meta = {
  title: 'features/reward/RewardAcquireScreen',
  component: RewardAcquireScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    onApply: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof RewardAcquireScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ThemeAcquired: Story = {
  args: {
    badgeText: '회고 5회 달성!',
    rewardName: '00테마',
    suffix: '를 획득했습니다!',
  },
};

export const CharacterPetAcquired: Story = {
  args: {
    badgeText: '한 달 연속 회고 달성!',
    rewardName: '나의 캐릭터 펫',
    suffix: '을 획득했습니다!',
  },
};
