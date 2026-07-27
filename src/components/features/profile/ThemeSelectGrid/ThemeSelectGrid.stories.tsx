import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CATEGORY_CHARACTER_MAP } from '@/src/lib/constants/character';

import ThemeSelectGrid from './ThemeSelectGrid';

const themeItems = [
  { id: 1, name: '테마 1', image: CATEGORY_CHARACTER_MAP.PAST_POSITIVE.src },
  {
    id: 2,
    name: '테마 2',
    image: CATEGORY_CHARACTER_MAP.PRESENT_HEDONISTIC.src,
  },
  { id: 3, name: '테마 3', image: CATEGORY_CHARACTER_MAP.FUTURE.src },
  {
    id: 4,
    name: '테마 4',
    image: CATEGORY_CHARACTER_MAP.PRESENT_FATALISTIC.src,
  },
];

const decorationItems = [
  {
    id: 11,
    name: '펫 1',
    image: CATEGORY_CHARACTER_MAP.PAST_POSITIVE.profileSrc,
  },
  {
    id: 12,
    name: '펫 2',
    image: CATEGORY_CHARACTER_MAP.PAST_NEGATIVE.profileSrc,
  },
  { id: 13, name: '펫 3', image: CATEGORY_CHARACTER_MAP.FUTURE.profileSrc },
  {
    id: 14,
    name: '펫 4',
    image: CATEGORY_CHARACTER_MAP.PRESENT_FATALISTIC.profileSrc,
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
