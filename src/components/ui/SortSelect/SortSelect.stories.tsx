import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SORT_OPTIONS } from '@/src/components/features/groups/constants/groupSort';

import SortSelect from './SortSelect';

const meta = {
  title: 'UI/SortSelect',
  component: SortSelect,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SortSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: SORT_OPTIONS,
    value: SORT_OPTIONS[0].value,
  },
};
