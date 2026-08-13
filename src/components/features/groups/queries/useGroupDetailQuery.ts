import { useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';
import { CATEGORY } from '@/src/lib/constants/character';

import { groupTypeSchema } from '../constants/groupType';
import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

const ResponseSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  type: groupTypeSchema,
  image: z.string().nullable(),
  category: z.enum(CATEGORY).nullable(),
  memberCount: z.number(),
  isMember: z.boolean(),
  myRole: z.enum(['OWNER', 'MEMBER']).nullable(),
  createdAt: z.coerce.date(),
});

export type GroupDetail = z.infer<typeof ResponseSchema>;

const fetchGroupDetail = (groupId: number) =>
  get<GroupDetail>(GROUP_ENDPOINT.group(groupId), {
    responseSchema: ResponseSchema,
  });

export const useSuspenseGroupDetailQuery = (groupId: number) =>
  useSuspenseQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: () => fetchGroupDetail(groupId),
  });
