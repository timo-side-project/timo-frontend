'use client';

import Icon from '@/src/components/ui/Icon/Icon';

import { useReflectionLikeState } from '../../hooks/useReflectionLikeState';
import { useReflectionCommentsQuery } from '../../queries/useReflectionCommentsQuery';

interface ReflectionEngagementActionsProps {
  groupId: number;
  reflectionId: number;
  initialIsLiked?: boolean;
  initialLikeCount?: number;
  initialCommentCount?: number;
  onCommentClick: () => void;
}

const ReflectionEngagementActions = ({
  groupId,
  reflectionId,
  initialIsLiked,
  initialLikeCount,
  initialCommentCount,
  onCommentClick,
}: ReflectionEngagementActionsProps) => {
  const { likeCount, toggle, isToggling } = useReflectionLikeState({
    groupId,
    reflectionId,
    initialIsLiked,
    initialLikeCount,
  });
  const { data: comments } = useReflectionCommentsQuery({
    groupId,
    reflectionId,
  });
  const commentCount = comments?.length ?? initialCommentCount ?? 0;

  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={toggle}
        disabled={isToggling}
        className="flex items-center gap-1.25 rounded-2xl bg-g-400 px-2.5 py-1.25"
      >
        <Icon
          name={likeCount > 0 ? 'heartFill' : 'heartEmpty'}
          size={28}
          alt="좋아요"
        />
        {likeCount > 0 && (
          <span className="font-body-base text-primary">{likeCount}</span>
        )}
      </button>

      <button
        type="button"
        onClick={onCommentClick}
        className="flex items-center gap-1.25 rounded-2xl bg-g-400 px-2.5 py-1.25"
      >
        <Icon
          name={commentCount > 0 ? 'commentFill' : 'commentEmpty'}
          size={28}
          alt="댓글"
        />
        {commentCount > 0 && (
          <span className="font-body-base text-primary">{commentCount}</span>
        )}
      </button>
    </div>
  );
};

export default ReflectionEngagementActions;
