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

export const Today: Story = {
  args: {
    selectedDate: new Date(),
    isNextDisabled: true,
  },
};

export const PastDate: Story = {
  args: {
    selectedDate: subDays(new Date(), 14),
    isNextDisabled: false,
  },
};
