import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { format } from 'date-fns';

import type { GroupFriendItem } from '@/src/components/features/groups/queries/useGroupFriendListQuery';
import { CALENDAR_DATE_FORMAT } from '@/src/lib/constants/calendar';

import { groupKeys } from '../constants/queryKey';
import FriendReflectionPanel from './FriendReflectionPanel';

const GROUP_ID = 1;
const today = new Date();

/** 스토리의 친구 정보를 오늘 회고 한 건으로 만들어 캐시에 심는다 */
const withSeededCalendar: Decorator = (Story, context) => {
  const friend = context.args.friend as GroupFriendItem | null;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });

  if (friend?.questionCategory && friend.questionContent && friend.answerText) {
    queryClient.setQueryData(
      groupKeys.memberCalendar(
        GROUP_ID,
        friend.userId,
        format(today, CALENDAR_DATE_FORMAT.monthRequest),
      ),
      [
        {
          id: 1,
          question: {
            category: friend.questionCategory,
            content: friend.questionContent,
          },
          content: friend.answerText,
          isPublic: true,
          reflectedAt: format(today, CALENDAR_DATE_FORMAT.dayKey),
        },
      ],
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

const meta = {
  title: 'Features/Groups/FriendReflectionPanel',
  component: FriendReflectionPanel,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  decorators: [withSeededCalendar],
  args: {
    groupId: GROUP_ID,
    onClose: () => {},
  },
} satisfies Meta<typeof FriendReflectionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFriend: GroupFriendItem = {
  userId: 1,
  nickname: '지민',
  questionContent: '오늘 하루 중 가장 기억에 남는 순간은 무엇인가요?',
  questionCategory: 'PRESENT_HEDONISTIC',
  userCategory: 'PRESENT_HEDONISTIC',
  answerText:
    '오늘은 오랜 친구를 만나서 함께 카페에서 이야기를 나눴어요. 별거 아닌 일상 얘기였지만 정말 즐거웠고 많이 웃었습니다.',
  streakDays: 14,
  totalDays: 30,
};

export const Open: Story = {
  args: {
    friend: mockFriend,
  },
};

export const Closed: Story = {
  args: {
    friend: null,
  },
};

export const PastPositive: Story = {
  args: {
    friend: {
      ...mockFriend,
      nickname: '수진',
      questionCategory: 'PAST_POSITIVE',
      questionContent: '과거에 가장 행복했던 기억은 무엇인가요?',
      answerText: '초등학교 때 가족과 함께 바다로 여행을 떠났던 기억이 납니다.',
    },
  },
};

export const Future: Story = {
  args: {
    friend: {
      ...mockFriend,
      nickname: '현우',
      questionCategory: 'FUTURE',
      questionContent: '올해 꼭 이루고 싶은 목표가 있나요?',
      answerText:
        '매일 30분씩 운동하는 습관을 만들고 싶어요. 작은 것부터 시작해서 꾸준히 해나가겠습니다.',
    },
  },
};

export const LongAnswer: Story = {
  args: {
    friend: {
      ...mockFriend,
      nickname: '예린',
      questionCategory: 'PAST_NEGATIVE',
      questionContent: '최근에 후회되는 일이 있었나요?',
      answerText:
        '친구에게 상처 주는 말을 무심코 했는데 그게 계속 마음에 걸려요. 그때 더 신중하게 말했어야 했는데, 이제는 그 친구가 저를 어떻게 생각할지 걱정됩니다. 앞으로는 말하기 전에 한 번 더 생각하는 습관을 들여야겠다고 다짐했어요.',
    },
  },
};
