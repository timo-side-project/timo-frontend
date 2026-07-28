import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';
import { CATEGORY } from '@/src/lib/constants/character';

import { userKeys } from '../constants/queryKeys';
import { USER_ENDPOINTS } from '../constants/url';

const equippedCustomizationSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['THEME', 'DECORATION']),
  image: z.string(),
  imageWithoutBackground: z.string(),
});

const userDetailSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  provider: z.string(),
  category: z.enum(CATEGORY),
  streakDays: z.number(),
  isOnboarded: z.boolean(),
  createdAt: z.string(),
  equippedCustomizations: z.array(equippedCustomizationSchema),
});

export type UserDetailResponse = z.infer<typeof userDetailSchema>;

export const getUserDetail = async (): Promise<UserDetailResponse> => {
  return get<UserDetailResponse>(USER_ENDPOINTS.detail, {
    responseSchema: userDetailSchema,
  });
};

export const useUserDetailQuery = () =>
  useQuery({
    queryKey: userKeys.detail(),
    queryFn: getUserDetail,
  });

export const useSuspenseUserDetailQuery = () =>
  useSuspenseQuery({
    queryKey: userKeys.detail(),
    queryFn: getUserDetail,
  });
