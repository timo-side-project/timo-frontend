import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { subDays } from 'date-fns';

import FriendReflectionDateNav from './FriendReflectionDateNav';

const meta = {
  title: 'Features/Groups/FriendReflectionDateNav',
  component: FriendReflectionDateNav,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  tags: ['autodocs'],
  args: {
    onPrevDate: () => {},
    onNextDate: () => {},
    onOpenCalendar: () => {},
  },
} satisfies Meta<typeof FriendReflectionDateNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const referenceDate = new Date(2026, 7, 27);

export const Today: Story = {
  args: {
    selectedDate: referenceDate,
    isNextDisabled: true,
  },
};

export const PastDate: Story = {
  args: {
    selectedDate: subDays(referenceDate, 14),
    isNextDisabled: false,
  },
};
