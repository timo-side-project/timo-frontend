import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

interface DeleteCommentParams {
  groupId: number;
  reflectionId: number;
  commentId: number;
}

const deleteReflectionComment = ({
  groupId,
  reflectionId,
  commentId,
}: DeleteCommentParams) =>
  del<never, void>(
    GROUP_ENDPOINT.reflectionComment(groupId, reflectionId, commentId),
  );

export const useDeleteReflectionCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: groupKeys.deleteComment(),
    mutationFn: deleteReflectionComment,
    onSuccess: (_data, { groupId, reflectionId }) => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.comments(groupId, reflectionId),
      });
    },
  });
};
