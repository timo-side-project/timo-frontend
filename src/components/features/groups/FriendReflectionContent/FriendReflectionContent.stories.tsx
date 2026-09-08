import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

import { CALENDAR_DATE_FORMAT } from '@/src/lib/constants/calendar';

import { groupKeys } from '../constants/queryKey';
import type { GroupFriendItem } from '../queries/useGroupFriendListQuery';
import type { MemberCalendarItem } from '../queries/useGroupMemberCalendarQuery';
import FriendReflectionContent from './FriendReflectionContent';

const GROUP_ID = 1;
const today = new Date();

const mockFriend: GroupFriendItem = {
  userId: 7,
  nickname: 'Leon',
  questionContent: null,
  questionCategory: null,
  answerText: null,
  streakDays: 12,
  totalDays: 202,
  userCategory: 'PAST_NEGATIVE',
};

const todayReflection: MemberCalendarItem = {
  id: 1,
  question: {
    category: 'PRESENT_HEDONISTIC',
    content: '오늘 하루 중 가장 재미있었던 순간은 언제였나요?',
  },
  content:
    '오늘 하루 중 가장 즐거웠던 순간은 점심시간이었습니다. 팀원들과 회사 뒤편에 새로 생긴 한식당을 찾았는데, 아직 입소문이 덜 났는지 손님이 우리 테이블밖에 없어 마치 가게를 통째로 빌린 기분이었습니다.',
  isPublic: true,
  reflectedAt: format(today, CALENDAR_DATE_FORMAT.dayKey),
};

const pastReflection: MemberCalendarItem = {
  ...todayReflection,
  id: 2,
  reflectedAt: format(subDays(today, 3), CALENDAR_DATE_FORMAT.dayKey),
};

const privateReflection: MemberCalendarItem = {
  ...todayReflection,
  id: 3,
  isPublic: false,
};

const createQueryClient = (reflections: MemberCalendarItem[]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });

  queryClient.setQueryData(
    groupKeys.memberCalendar(
      GROUP_ID,
      mockFriend.userId,
      format(today, CALENDAR_DATE_FORMAT.monthRequest),
    ),
    reflections,
  );

  return queryClient;
};

const meta = {
  title: 'Features/Groups/FriendReflectionContent',
  component: FriendReflectionContent,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  args: { groupId: GROUP_ID, friend: mockFriend },
} satisfies Meta<typeof FriendReflectionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTodayReflection: Story = {
  render: (args) => (
    <QueryClientProvider client={createQueryClient([todayReflection])}>
      <FriendReflectionContent {...args} />
    </QueryClientProvider>
  ),
};

export const EmptyDate: Story = {
  render: (args) => (
    <QueryClientProvider client={createQueryClient([pastReflection])}>
      <FriendReflectionContent {...args} />
    </QueryClientProvider>
  ),
};

export const PrivateReflection: Story = {
  render: (args) => (
    <QueryClientProvider client={createQueryClient([privateReflection])}>
      <FriendReflectionContent {...args} />
    </QueryClientProvider>
  ),
};
