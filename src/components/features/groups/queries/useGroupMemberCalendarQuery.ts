import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';
import { CATEGORY } from '@/src/lib/constants/character';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

export const MemberCalendarItemSchema = z.object({
  id: z.number(),
  question: z.object({
    category: z.enum(CATEGORY),
    content: z.string(),
  }),
  content: z.string(),
  isPublic: z.boolean(),
  reflectedAt: z.string(),
});
const ResponseSchema = z.array(MemberCalendarItemSchema);
export type MemberCalendarItem = z.infer<typeof MemberCalendarItemSchema>;
type ResponseType = z.infer<typeof ResponseSchema>;

const ParamsSchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), // 2026-08 형태
});
type ParamsType = z.infer<typeof ParamsSchema>;

export const groupMemberCalendar = ({
  groupId,
  userId,
  month,
}: { groupId: number; userId: number } & ParamsType) =>
  get<ResponseType, ParamsType>(
    GROUP_ENDPOINT.memberCalendar(groupId, userId),
    {
      params: { month },
      paramsSchema: ParamsSchema,
      responseSchema: ResponseSchema,
    },
  );

export const useGroupMemberCalendarQuery = ({
  groupId,
  userId,
  month,
}: { groupId: number; userId: number } & ParamsType) =>
  useQuery({
    queryKey: groupKeys.memberCalendar(groupId, userId, month),
    queryFn: () => groupMemberCalendar({ groupId, userId, month }),
    staleTime: 60 * 1000 * 5,
  });
