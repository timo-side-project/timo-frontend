import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

import { userKeys } from '@/src/components/features/users/constants/queryKeys';
import type { UserDetailResponse } from '@/src/components/features/users/queries/useUserDetailQuery';
import ToastProvider from '@/src/components/ui/Toast/ToastProvider';
import { CALENDAR_DATE_FORMAT } from '@/src/lib/constants/calendar';

import { groupKeys } from '../../constants/queryKey';
import type { MemberCalendarItem } from '../../queries/useGroupMemberCalendarQuery';
import type { ReflectionDetail } from '../../queries/useReflectionDetailQuery';
import FriendReflectionContent from './FriendReflectionContent';

const GROUP_ID = 1;
const USER_ID = 7;
const OTHER_USER_ID = 1;
const today = new Date();

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

const createCurrentUser = (id: number): UserDetailResponse => ({
  id,
  email: 'test@test.com',
  name: 'Leon',
  provider: 'google',
  category: 'PRESENT_HEDONISTIC',
  streakDays: 12,
  isOnboarded: true,
  createdAt: today.toISOString(),
  equippedCustomizations: [],
});

const toReflectionDetail = (
  reflection: MemberCalendarItem,
  isMine: boolean,
): ReflectionDetail => ({
  id: reflection.id,
  question: {
    id: 1,
    sequence: 1,
    category: reflection.question.category,
    content: reflection.question.content,
    createdBy: 'system',
    createdAt: today.toISOString(),
  },
  content: reflection.content,
  reflectedAt: reflection.reflectedAt,
  likes: 13,
  comments: 2,
  isLiked: false,
  nickname: 'Leon',
  isMine,
  isPublic: reflection.isPublic,
});

const createQueryClient = (
  reflections: MemberCalendarItem[],
  currentUserId: number,
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });

  queryClient.setQueryData(userKeys.detail(), createCurrentUser(currentUserId));

  queryClient.setQueryData(
    groupKeys.memberCalendar(
      GROUP_ID,
      USER_ID,
      format(today, CALENDAR_DATE_FORMAT.monthRequest),
    ),
    reflections,
  );

  for (const reflection of reflections) {
    queryClient.setQueryData(
      groupKeys.reflectionDetail(GROUP_ID, reflection.id),
      toReflectionDetail(reflection, currentUserId === USER_ID),
    );
  }

  return queryClient;
};

const meta = {
  title: 'Features/Groups/FriendReflectionContent',
  component: FriendReflectionContent,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    nextjs: { appDirectory: true },
  },
  tags: ['autodocs'],
  args: { groupId: GROUP_ID, userId: USER_ID },
} satisfies Meta<typeof FriendReflectionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const withProviders = (
  reflections: MemberCalendarItem[],
  args: React.ComponentProps<typeof FriendReflectionContent>,
  currentUserId = OTHER_USER_ID,
) => (
  <QueryClientProvider client={createQueryClient(reflections, currentUserId)}>
    <ToastProvider>
      <FriendReflectionContent {...args} />
    </ToastProvider>
  </QueryClientProvider>
);

export const WithTodayReflection: Story = {
  render: (args) => withProviders([todayReflection], args),
};

export const EmptyDate: Story = {
  render: (args) => withProviders([pastReflection], args),
};

export const PrivateReflection: Story = {
  render: (args) => withProviders([privateReflection], args),
};

/** 내 회고는 비공개여도 상세와 공개 전환 토글을 보여준다 */
export const MyPrivateReflection: Story = {
  render: (args) => withProviders([privateReflection], args, USER_ID),
};
