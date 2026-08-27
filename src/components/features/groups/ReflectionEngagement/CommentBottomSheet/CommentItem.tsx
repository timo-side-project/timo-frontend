import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';

import { CATEGORY_CHARACTER_MAP } from '@/src/lib/constants/character';
import { cn } from '@/src/lib/helpers/cn';
import { formatRelativeTime } from '@/src/lib/helpers/formatRelativeTime';

import type { ReflectionComment } from '../../queries/useReflectionCommentsQuery';

interface CommentItemProps {
  comment: ReflectionComment;
  isMine?: boolean;
  isEditing?: boolean;
  onEditStart?: () => void;
  onEditSubmit?: (content: string) => void;
  onEditCancel?: () => void;
  onDelete?: () => void;
}

const CommentItem = ({
  comment,
  isMine = false,
  isEditing = false,
  onEditStart,
  onEditSubmit,
  onEditCancel,
  onDelete,
}: CommentItemProps) => {
  const { profileSrc, alt } = CATEGORY_CHARACTER_MAP[comment.commenterCategory];

  const [draft, setDraft] = useState(comment.content);
  const [wasEditing, setWasEditing] = useState(isEditing);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (isEditing !== wasEditing) {
    setWasEditing(isEditing);
    if (isEditing) setDraft(comment.content);
  }

  useLayoutEffect(() => {
    if (!isEditing) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [isEditing, draft]);

  const handleSubmit = () => {
    const content = draft.trim();
    if (!content) return;
    onEditSubmit?.(content);
  };

  return (
    <div
      className={cn(
        'w-full rounded-tl-[10px] rounded-tr-[10px] bg-g-200 p-2.5',
        isMine ? 'rounded-bl-[10px]' : 'rounded-br-[10px]',
        isMine && 'border border-g-40',
      )}
    >
      <div className="flex w-full items-start gap-3">
        <div className="relative size-11.25 shrink-0 overflow-hidden rounded-[7.5px]">
          <Image src={profileSrc} alt={alt} fill className="object-cover" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate font-label-n text-g-0">
                {comment.commenterNickname}
              </p>
              <p className="shrink-0 font-caption-n text-g-80">
                {formatRelativeTime(comment.createdAt)}
              </p>
            </div>

            {isMine && (
              <div className="flex shrink-0 gap-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="font-caption-n text-g-80"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={onEditCancel}
                      className="font-caption-n text-g-80"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    {onEditStart && (
                      <button
                        type="button"
                        onClick={onEditStart}
                        className="font-caption-n text-g-80"
                      >
                        수정
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={onDelete}
                        className="font-caption-n text-g-80"
                      >
                        삭제
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={1}
              className="w-full resize-none overflow-hidden rounded-lg border border-g-40 bg-g-600 p-4 font-caption-n text-g-60 focus:outline-none"
            />
          ) : (
            <p className="truncate font-caption-n text-g-60">
              {comment.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
