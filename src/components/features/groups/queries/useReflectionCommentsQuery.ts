import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';
import { CATEGORY } from '@/src/lib/constants/character';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

interface RequestType {
  groupId: number;
  reflectionId: number;
}

export const reflectionCommentSchema = z.object({
  id: z.number(),
  commenterId: z.number(),
  commenterNickname: z.string(),
  commenterCategory: z.enum(CATEGORY),
  content: z.string(),
  createdAt: z.string(),
});
const ResponseSchema = z.array(reflectionCommentSchema);
export type ReflectionComment = z.infer<typeof reflectionCommentSchema>;
type ResponseType = z.infer<typeof ResponseSchema>;

export const getReflectionComments = ({ groupId, reflectionId }: RequestType) =>
  get<ResponseType>(GROUP_ENDPOINT.reflectionComments(groupId, reflectionId), {
    responseSchema: ResponseSchema,
  });

export const useReflectionCommentsQuery = ({
  groupId,
  reflectionId,
}: RequestType) => {
  return useQuery({
    queryKey: groupKeys.comments(groupId, reflectionId),
    queryFn: () => getReflectionComments({ groupId, reflectionId }),
    staleTime: 30 * 1000,
  });
};
