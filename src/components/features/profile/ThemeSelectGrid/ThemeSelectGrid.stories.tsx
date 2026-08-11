import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CATEGORY_CHARACTER_MAP } from '@/src/lib/constants/character';

import ThemeSelectGrid from './ThemeSelectGrid';

const themeItems = [
  {
    id: 1,
    name: '테마 1',
    image: CATEGORY_CHARACTER_MAP.PAST_POSITIVE.src,
    isUnlocked: true,
  },
  {
    id: 2,
    name: '테마 2',
    image: CATEGORY_CHARACTER_MAP.PRESENT_HEDONISTIC.src,
    isUnlocked: true,
  },
  {
    id: 3,
    name: '테마 3',
    image: CATEGORY_CHARACTER_MAP.FUTURE.src,
    isUnlocked: true,
  },
  {
    id: 4,
    name: '테마 4',
    image: CATEGORY_CHARACTER_MAP.PRESENT_FATALISTIC.src,
    isUnlocked: false,
  },
];

const decorationItems = [
  {
    id: 11,
    name: '펫 1',
    image: CATEGORY_CHARACTER_MAP.PAST_POSITIVE.profileSrc,
    isUnlocked: true,
  },
  {
    id: 12,
    name: '펫 2',
    image: CATEGORY_CHARACTER_MAP.PAST_NEGATIVE.profileSrc,
    isUnlocked: true,
  },
  {
    id: 13,
    name: '펫 3',
    image: CATEGORY_CHARACTER_MAP.FUTURE.profileSrc,
    isUnlocked: true,
  },
  {
    id: 14,
    name: '펫 4',
    image: CATEGORY_CHARACTER_MAP.PRESENT_FATALISTIC.profileSrc,
    isUnlocked: false,
  },
];

const meta = {
  title: 'Features/Profile/ThemeSelectGrid',
  component: ThemeSelectGrid,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  args: {
    title: '테마',
    items: themeItems,
    selectedId: themeItems[0].id,
    onSelect: () => {},
    isPending: false,
    isError: false,
    variant: 'THEME',
  },
} satisfies Meta<typeof ThemeSelectGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Theme: Story = {};

export const Decoration: Story = {
  args: {
    title: '펫',
    items: decorationItems,
    selectedId: decorationItems[0].id,
    variant: 'DECORATION',
  },
};

export const Loading: Story = {
  args: { isPending: true },
};

export const Empty: Story = {
  args: { items: [] },
};
