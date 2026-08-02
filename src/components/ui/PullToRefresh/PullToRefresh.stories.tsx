import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PullToRefresh from './PullToRefresh';

const queryClient = new QueryClient();

const meta = {
  title: 'UI/PullToRefresh',
  component: PullToRefresh,
  args: {
    queryKeys: [['example']],
    children: (
      <div className="flex h-80 flex-col gap-2 p-4">
        <p className="text-g-500">
          아래로 당겨서 새로고침 (터치 환경에서 확인)
        </p>
        <div className="rounded-2xl bg-g-20 p-4">콘텐츠 영역</div>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof PullToRefresh>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
