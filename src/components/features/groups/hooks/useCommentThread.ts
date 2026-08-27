import { useCallback, useState } from 'react';

import { useUserDetailQuery } from '@/src/components/features/users/queries/useUserDetailQuery';
import { useToast } from '@/src/hooks/useToast';

import { useCreateReflectionCommentMutation } from '../queries/useCreateReflectionCommentMutation';
import { useDeleteReflectionCommentMutation } from '../queries/useDeleteReflectionCommentMutation';
import type { ReflectionComment } from '../queries/useReflectionCommentsQuery';
import { useReflectionCommentsQuery } from '../queries/useReflectionCommentsQuery';
import { useUpdateReflectionCommentMutation } from '../queries/useUpdateReflectionCommentMutation';

interface UseCommentThreadParams {
  groupId: number;
  reflectionId: number;
}

export const useCommentThread = ({
  groupId,
  reflectionId,
}: UseCommentThreadParams) => {
  const { showToast } = useToast();
  const { data: currentUser } = useUserDetailQuery();
  const { data: comments } = useReflectionCommentsQuery({
    groupId,
    reflectionId,
  });

  const { mutate: createComment, isPending: isCreating } =
    useCreateReflectionCommentMutation();
  const { mutate: updateComment } = useUpdateReflectionCommentMutation();
  const { mutate: deleteComment } = useDeleteReflectionCommentMutation();

  const [inputValue, setInputValue] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const reset = useCallback(() => {
    setInputValue('');
    setEditingCommentId(null);
  }, []);

  const handleEditStart = (comment: ReflectionComment) => {
    setEditingCommentId(comment.id);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
  };

  const handleEditSubmit = (comment: ReflectionComment, content: string) => {
    updateComment(
      { groupId, reflectionId, commentId: comment.id, content },
      {
        onSuccess: () => setEditingCommentId(null),
        onError: () =>
          showToast({ message: '댓글 수정에 실패했어요', variant: 'alert' }),
      },
    );
  };

  const handleDelete = (comment: ReflectionComment) => {
    deleteComment(
      { groupId, reflectionId, commentId: comment.id },
      {
        onError: () =>
          showToast({ message: '댓글 삭제에 실패했어요', variant: 'alert' }),
      },
    );
  };

  const handleSubmit = () => {
    const content = inputValue.trim();
    if (!content) return;

    createComment(
      { groupId, reflectionId, content },
      {
        onSuccess: () => setInputValue(''),
        onError: () =>
          showToast({ message: '댓글 작성에 실패했어요', variant: 'alert' }),
      },
    );
  };

  return {
    comments: comments ?? [],
    currentUserId: currentUser?.id,
    inputValue,
    setInputValue,
    editingCommentId,
    isCreating,
    reset,
    handleEditStart,
    handleEditCancel,
    handleEditSubmit,
    handleDelete,
    handleSubmit,
  };
};
