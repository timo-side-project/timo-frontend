import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';
import { CATEGORY } from '@/src/lib/constants/character';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

const reflectionQuestionSchema = z.object({
  id: z.number(),
  sequence: z.number(),
  category: z.enum(CATEGORY),
  content: z.string(),
  createdBy: z.string(),
  createdAt: z.string(),
});

export const reflectionDetailSchema = z.object({
  id: z.number(),
  question: reflectionQuestionSchema,
  content: z.string(),
  reflectedAt: z.string(),
  likes: z.number(),
  comments: z.number(),
  isLiked: z.boolean(),
  nickname: z.string(),
});
export type ReflectionDetail = z.infer<typeof reflectionDetailSchema>;

interface ReflectionDetailParams {
  groupId: number;
  reflectionId: number;
}

export const getReflectionDetail = ({
  groupId,
  reflectionId,
}: ReflectionDetailParams) =>
  get<ReflectionDetail>(
    GROUP_ENDPOINT.reflectionDetail(groupId, reflectionId),
    {
      responseSchema: reflectionDetailSchema,
    },
  );

export const useReflectionDetailQuery = ({
  groupId,
  reflectionId,
}: ReflectionDetailParams) => {
  return useQuery({
    queryKey: groupKeys.reflectionDetail(groupId, reflectionId),
    queryFn: () => getReflectionDetail({ groupId, reflectionId }),
    staleTime: 60 * 1000,
  });
};
