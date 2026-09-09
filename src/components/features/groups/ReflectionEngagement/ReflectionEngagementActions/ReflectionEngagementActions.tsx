'use client';

import { useReflectionLikeState } from '../../hooks/useReflectionLikeState';
import { useReflectionCommentsQuery } from '../../queries/useReflectionCommentsQuery';
import EngagementPill from '../EngagementPill/EngagementPill';

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
      <EngagementPill
        count={likeCount}
        filledIcon="heartFill"
        emptyIcon="heartEmpty"
        alt="좋아요"
        onClick={toggle}
        disabled={isToggling}
      />
      <EngagementPill
        count={commentCount}
        filledIcon="commentFill"
        emptyIcon="commentEmpty"
        alt="댓글"
        onClick={onCommentClick}
      />
    </div>
  );
};

export default ReflectionEngagementActions;
