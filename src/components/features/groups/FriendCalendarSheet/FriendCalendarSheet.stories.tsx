import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { format, setDate, startOfMonth } from 'date-fns';
import { useState } from 'react';

import { CALENDAR_DATE_FORMAT } from '@/src/lib/constants/calendar';

import { groupKeys } from '../constants/queryKey';
import type { MemberCalendarItem } from '../queries/useGroupMemberCalendarQuery';
import FriendCalendarSheet from './FriendCalendarSheet';

const GROUP_ID = 1;
const USER_ID = 7;
const today = new Date();
const monthStart = startOfMonth(today);

const reflectionOn = (
  day: number,
  category: MemberCalendarItem['question']['category'],
  isPublic: boolean,
): MemberCalendarItem => ({
  id: day,
  question: { category, content: '오늘 하루는 어땠나요?' },
  content: '오늘은 팀원들과 점심을 먹었습니다.',
  isPublic,
  reflectedAt: format(setDate(monthStart, day), CALENDAR_DATE_FORMAT.dayKey),
});

const reflections: MemberCalendarItem[] = [
  reflectionOn(1, 'PAST_NEGATIVE', true),
  reflectionOn(2, 'PRESENT_HEDONISTIC', false),
  reflectionOn(3, 'PAST_POSITIVE', true),
  reflectionOn(4, 'FUTURE', true),
  reflectionOn(5, 'PRESENT_FATALISTIC', false),
];

const createQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });

  queryClient.setQueryData(
    groupKeys.memberCalendar(
      GROUP_ID,
      USER_ID,
      format(today, CALENDAR_DATE_FORMAT.monthRequest),
    ),
    reflections,
  );

  return queryClient;
};

const meta = {
  title: 'Features/Groups/FriendCalendarSheet',
  component: FriendCalendarSheet,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    isOpen: false,
    groupId: GROUP_ID,
    userId: USER_ID,
    selectedDate: today,
    onClose: () => {},
    onSelectDate: () => {},
  },
} satisfies Meta<typeof FriendCalendarSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 공개 회고는 카테고리 색, 비공개(2·5일)는 회색 배경에 선택 불가 */
export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <QueryClientProvider client={createQueryClient()}>
        <div className="p-10">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-lg bg-g-0 px-4 py-3 font-body-s text-g-900"
          >
            캘린더 열기
          </button>

          <FriendCalendarSheet
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </QueryClientProvider>
    );
  },
};
