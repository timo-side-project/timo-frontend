import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { ReflectionDetail } from '@/src/components/features/groups/queries/useReflectionDetailQuery';
import ToastProvider from '@/src/components/ui/Toast/ToastProvider';

import { groupKeys } from '../../constants/queryKey';
import FriendReflectionDetail from './FriendReflectionDetail';

const GROUP_ID = 1;

const mockReflection: ReflectionDetail = {
  id: 1,
  question: {
    id: 1,
    sequence: 1,
    category: 'PRESENT_HEDONISTIC',
    content: '오늘 하루 중 가장 기억에 남는 순간은 무엇인가요?',
    createdBy: 'system',
    createdAt: new Date().toISOString(),
  },
  content:
    '오늘은 오랜 친구를 만나서 함께 카페에서 이야기를 나눴어요. 별거 아닌 일상 얘기였지만 정말 즐거웠고 많이 웃었습니다.',
  reflectedAt: '2026-08-10',
  likes: 13,
  comments: 2,
  isLiked: false,
  nickname: '지민',
};

const createQueryClient = (
  reflectionId: number,
  reflection: ReflectionDetail,
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });
  queryClient.setQueryData(
    groupKeys.reflectionDetail(GROUP_ID, reflectionId),
    reflection,
  );
  return queryClient;
};

const meta = {
  title: 'Features/Groups/FriendReflectionDetail',
  component: FriendReflectionDetail,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    nextjs: { appDirectory: true },
  },
  tags: ['autodocs'],
  args: {
    groupId: GROUP_ID,
    reflectionId: 1,
  },
} satisfies Meta<typeof FriendReflectionDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <QueryClientProvider
      client={createQueryClient(args.reflectionId, mockReflection)}
    >
      <ToastProvider>
        <FriendReflectionDetail {...args} />
      </ToastProvider>
    </QueryClientProvider>
  ),
};

export const PastPositive: Story = {
  args: { reflectionId: 2 },
  render: (args) => {
    const reflection: ReflectionDetail = {
      ...mockReflection,
      id: 2,
      nickname: '수진',
      question: {
        ...mockReflection.question,
        category: 'PAST_POSITIVE',
        content: '과거에 가장 행복했던 기억은 무엇인가요?',
      },
      content: '초등학교 때 가족과 함께 바다로 여행을 떠났던 기억이 납니다.',
    };
    return (
      <QueryClientProvider
        client={createQueryClient(args.reflectionId, reflection)}
      >
        <ToastProvider>
          <FriendReflectionDetail {...args} />
        </ToastProvider>
      </QueryClientProvider>
    );
  },
};

export const Future: Story = {
  args: { reflectionId: 3 },
  render: (args) => {
    const reflection: ReflectionDetail = {
      ...mockReflection,
      id: 3,
      nickname: '현우',
      question: {
        ...mockReflection.question,
        category: 'FUTURE',
        content: '올해 꼭 이루고 싶은 목표가 있나요?',
      },
      content:
        '매일 30분씩 운동하는 습관을 만들고 싶어요. 작은 것부터 시작해서 꾸준히 해나가겠습니다.',
    };
    return (
      <QueryClientProvider
        client={createQueryClient(args.reflectionId, reflection)}
      >
        <ToastProvider>
          <FriendReflectionDetail {...args} />
        </ToastProvider>
      </QueryClientProvider>
    );
  },
};

export const LongAnswer: Story = {
  args: { reflectionId: 4 },
  render: (args) => {
    const reflection: ReflectionDetail = {
      ...mockReflection,
      id: 4,
      nickname: '예린',
      question: {
        ...mockReflection.question,
        category: 'PAST_NEGATIVE',
        content: '최근에 후회되는 일이 있었나요?',
      },
      content:
        '친구에게 상처 주는 말을 무심코 했는데 그게 계속 마음에 걸려요. 그때 더 신중하게 말했어야 했는데, 이제는 그 친구가 저를 어떻게 생각할지 걱정됩니다. 앞으로는 말하기 전에 한 번 더 생각하는 습관을 들여야겠다고 다짐했어요.',
    };
    return (
      <QueryClientProvider
        client={createQueryClient(args.reflectionId, reflection)}
      >
        <ToastProvider>
          <FriendReflectionDetail {...args} />
        </ToastProvider>
      </QueryClientProvider>
    );
  },
};
