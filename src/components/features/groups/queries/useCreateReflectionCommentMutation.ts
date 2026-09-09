import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { post } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

const createCommentRequestSchema = z.object({
  content: z.string().trim().min(1),
});
type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;

interface CreateCommentParams {
  groupId: number;
  reflectionId: number;
  content: string;
}

const createReflectionComment = ({
  groupId,
  reflectionId,
  content,
}: CreateCommentParams) =>
  post<CreateCommentRequest, void>(
    GROUP_ENDPOINT.reflectionComments(groupId, reflectionId),
    { content },
    { dataSchema: createCommentRequestSchema },
  );

export const useCreateReflectionCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: groupKeys.createComment(),
    mutationFn: createReflectionComment,
    onSuccess: (_data, { groupId, reflectionId }) => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.comments(groupId, reflectionId),
      });
    },
  });
};
