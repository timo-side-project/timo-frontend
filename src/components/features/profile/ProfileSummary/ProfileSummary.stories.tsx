import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CATEGORY_CHARACTER_MAP } from '@/src/lib/constants/character';

import { userKeys } from '../../users/constants/queryKeys';
import type { UserDetailResponse } from '../../users/queries/useUserDetailQuery';
import ProfileSummary from './ProfileSummary';

const baseUser: UserDetailResponse = {
  id: 1,
  email: 'test@test.com',
  name: '민지',
  provider: 'google',
  category: 'PRESENT_HEDONISTIC',
  streakDays: 12,
  isOnboarded: true,
  createdAt: new Date().toISOString(),
  equippedCustomizations: [],
};

const withDecorationsUser: UserDetailResponse = {
  ...baseUser,
  equippedCustomizations: [
    {
      id: 1,
      name: '테마 2',
      type: 'THEME',
      image: CATEGORY_CHARACTER_MAP.FUTURE.src,
      imageWithoutBackground: CATEGORY_CHARACTER_MAP.FUTURE.src,
    },
    {
      id: 11,
      name: '펫 1',
      type: 'DECORATION',
      image: CATEGORY_CHARACTER_MAP.PAST_POSITIVE.profileSrc,
      imageWithoutBackground: CATEGORY_CHARACTER_MAP.PAST_POSITIVE.profileSrc,
    },
  ],
};

const createQueryClient = (data: UserDetailResponse) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });
  queryClient.setQueryData(userKeys.detail(), data);
  return queryClient;
};

const meta = {
  title: 'Features/Profile/ProfileSummary',
  component: ProfileSummary,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <QueryClientProvider client={createQueryClient(baseUser)}>
      <ProfileSummary />
    </QueryClientProvider>
  ),
};

export const WithEquippedCustomizations: Story = {
  render: () => (
    <QueryClientProvider client={createQueryClient(withDecorationsUser)}>
      <ProfileSummary />
    </QueryClientProvider>
  ),
};
