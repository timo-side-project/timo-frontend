'use client';

import { useCallback } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/src/lib/helpers/cn';

import { useCommentThread } from '../../hooks/useCommentThread';
import { useModalDismiss } from '../../hooks/useModalDismiss';
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

  useModalDismiss({ isOpen, onClose: handleClose });

  if (typeof window === 'undefined') return null;

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
      </div>
    </div>,
    document.body,
  );
};

export default CommentBottomSheet;
