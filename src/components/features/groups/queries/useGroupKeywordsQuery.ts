import { skipToken, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

const groupKeywordsSchema = z.object({
  keywords: z.array(
    z.object({
      word: z.string(),
      count: z.number(),
    }),
  ),
});

export type GroupKeywordsResponse = z.infer<typeof groupKeywordsSchema>;

const getGroupKeywords = async (groupId: number) =>
  get<GroupKeywordsResponse>(GROUP_ENDPOINT.keywords(groupId), {
    responseSchema: groupKeywordsSchema,
  });

export const useGroupKeywordsQuery = (groupId: number | null) =>
  useQuery({
    queryKey: groupKeys.keywords(groupId),
    queryFn: groupId === null ? skipToken : () => getGroupKeywords(groupId),
    staleTime: 60 * 1000 * 5,
  });
