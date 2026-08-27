import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { put } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

const updateCommentRequestSchema = z.object({
  content: z.string().trim().min(1),
});
type UpdateCommentRequest = z.infer<typeof updateCommentRequestSchema>;

interface UpdateCommentParams {
  groupId: number;
  reflectionId: number;
  commentId: number;
  content: string;
}

const updateReflectionComment = ({
  groupId,
  reflectionId,
  commentId,
  content,
}: UpdateCommentParams) =>
  put<UpdateCommentRequest, void>(
    GROUP_ENDPOINT.reflectionComment(groupId, reflectionId, commentId),
    { content },
    { dataSchema: updateCommentRequestSchema },
  );

export const useUpdateReflectionCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: groupKeys.updateComment(),
    mutationFn: updateReflectionComment,
    onSuccess: (_data, { groupId, reflectionId }) => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.comments(groupId, reflectionId),
      });
    },
  });
};
