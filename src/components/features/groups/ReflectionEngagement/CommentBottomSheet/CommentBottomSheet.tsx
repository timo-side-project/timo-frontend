'use client';

import { useCallback } from 'react';

import BottomSheet from '@/src/components/ui/BottomSheet/BottomSheet';

import { useCommentThread } from '../../hooks/useCommentThread';
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
  const {
    comments,
    currentUserId,
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
  } = useCommentThread({ groupId, reflectionId });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="댓글"
      contentClassName="flex flex-col items-center gap-6.25 rounded-t-2xl px-6.25 pb-8.5 pt-8.5"
    >
      <p className="font-heading-h3 text-g-0">댓글</p>

      <div className="flex w-full flex-col gap-7.5">
        <CommentList
          comments={comments}
          currentUserId={currentUserId}
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
    </BottomSheet>
  );
};

export default CommentBottomSheet;
