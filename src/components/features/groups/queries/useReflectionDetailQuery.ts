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
  // 백엔드 응답에 아직 없음 — 좋아요 여부 판단용, 추가되는 대로 활성화
  isLiked: z.boolean().optional(),
  nickname: z.string(),
});
export type ReflectionDetail = z.infer<typeof reflectionDetailSchema>;

export const getReflectionDetail = ({
  groupId,
  reflectionId,
}: {
  groupId: number;
  reflectionId: number;
}) =>
  get<ReflectionDetail>(
    GROUP_ENDPOINT.reflectionDetail(groupId, reflectionId),
    {
      responseSchema: reflectionDetailSchema,
    },
  );

export const useReflectionDetailQuery = ({
  groupId,
  reflectionId,
}: {
  groupId: number | null;
  reflectionId: number | null;
}) => {
  return useQuery({
    queryKey: groupKeys.reflectionDetail(groupId ?? -1, reflectionId ?? -1),
    queryFn: () =>
      getReflectionDetail({
        groupId: groupId as number,
        reflectionId: reflectionId as number,
      }),
    enabled: groupId !== null && reflectionId !== null,
    staleTime: 60 * 1000,
  });
};
