import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import RewardResultModal from './RewardResultModal';

const meta = {
  title: 'features/reward/RewardResultModal',
  component: RewardResultModal,
  args: {
    isOpen: true,
    onClose: fn(),
  },
} satisfies Meta<typeof RewardResultModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ThemeApplied: Story = {
  args: {
    title: '00테마 적용 완료',
    description: '00테마 적용이 완료되었습니다',
    imageSrc: undefined,
  },
};

export const ThemeSavedWithViewLink: Story = {
  args: {
    title: '00테마 저장 완료',
    description: '00테마 저장이 완료되었습니다',
    onView: fn(),
  },
};

export const CharacterPetApplied: Story = {
  args: {
    title: '나의 캐릭터 펫 적용 완료',
    description: '나의 캐릭터 펫 적용이 완료되었습니다',
  },
};

export const CharacterPetSaved: Story = {
  args: {
    title: '나의 캐릭터 펫 저장 완료',
    description: '나의 캐릭터 펫 저장이 완료되었습니다',
  },
};
