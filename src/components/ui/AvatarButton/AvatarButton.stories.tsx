import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { createElement } from 'react';

import { CATEGORY_CHARACTER_MAP } from '@/src/lib/constants/character';

import AvatarButton from './AvatarButton';

const meta = {
  title: 'UI/AvatarButton',
  component: AvatarButton,
  tags: ['autodocs'],
  args: {
    src: CATEGORY_CHARACTER_MAP.PAST_POSITIVE.profileSrc,
    label: '추억이',
    isSelected: false,
  },
} satisfies Meta<typeof AvatarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

export const CharacterRow: Story = {
  render: () =>
    createElement(
      'div',
      { className: 'flex gap-4 overflow-x-auto' },
      ...Object.entries(CATEGORY_CHARACTER_MAP).map(([, asset], i) =>
        createElement(AvatarButton, {
          key: asset.name,
          src: asset.profileSrc,
          label: asset.name,
          isSelected: i === 0,
        }),
      ),
    ),
};
