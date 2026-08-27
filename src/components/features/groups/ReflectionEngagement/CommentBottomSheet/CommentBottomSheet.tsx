'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useUserDetailQuery } from '@/src/components/features/users/queries/useUserDetailQuery';
import { useToast } from '@/src/hooks/useToast';
import { cn } from '@/src/lib/helpers/cn';

import { useCreateReflectionCommentMutation } from '../../queries/useCreateReflectionCommentMutation';
import { useDeleteReflectionCommentMutation } from '../../queries/useDeleteReflectionCommentMutation';
import type { ReflectionComment } from '../../queries/useReflectionCommentsQuery';
import { useReflectionCommentsQuery } from '../../queries/useReflectionCommentsQuery';
import { useUpdateReflectionCommentMutation } from '../../queries/useUpdateReflectionCommentMutation';
import CommentInput from './CommentInput';
import CommentList from './CommentList';

interface CommentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  reflectionId: number;
}

const CommentBottomSheet = ({
  isOpen,
  onClose,
  groupId,
  reflectionId,
}: CommentBottomSheetProps) => {
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

  const handleClose = useCallback(() => {
    setInputValue('');
    setEditingCommentId(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (typeof window === 'undefined') return null;

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

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <button
        type="button"
        aria-label="댓글창 닫기"
        onClick={handleClose}
        className="absolute inset-0 bg-g-900/80"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-110 flex-col items-center gap-6.25 rounded-t-2xl bg-g-600 px-6.25 pb-8.5 pt-8.5 transition-transform duration-300',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <p className="font-heading-h3 text-g-0">댓글</p>

        <div className="flex w-full flex-col gap-7.5">
          <CommentList
            comments={comments ?? []}
            currentUserId={currentUser?.id}
            editingCommentId={editingCommentId}
            onEditStart={handleEditStart}
            onEditSubmit={handleEditSubmit}
            onEditCancel={handleEditCancel}
            onDelete={handleDelete}
          />

          <CommentInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            disabled={isCreating}
            placeholder="댓글을 입력해주세요"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CommentBottomSheet;
