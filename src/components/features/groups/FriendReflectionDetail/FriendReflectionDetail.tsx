'use client';

import { useState } from 'react';

import Detail from '@/src/components/features/reflectionDetail/Detail/Detail';
import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';

import { useReflectionDetailQuery } from '../queries/useReflectionDetailQuery';
import CommentBottomSheet from '../ReflectionEngagement/CommentBottomSheet/CommentBottomSheet';
import ReflectionEngagementActions from '../ReflectionEngagement/ReflectionEngagementActions/ReflectionEngagementActions';

interface FriendReflectionDetailProps {
  groupId: number;
  reflectionId: number;
}

const FriendReflectionDetail = ({
  groupId,
  reflectionId,
}: FriendReflectionDetailProps) => {
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);

  const { data, isPending, isError, refetch } = useReflectionDetailQuery({
    groupId,
    reflectionId,
  });

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-10" />
        <Skeleton className="h-40" />
        <Skeleton className="h-30" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="회고를 불러오는 데 실패했어요."
        description="잠시 후 다시 시도해주세요."
        onRetry={refetch}
        className="py-15"
      />
    );
  }

  return (
    <>
      <Detail
        questionCategory={data.question.category}
        questionContent={data.question.content}
        answerContent={data.content}
        friendNickname={data.nickname}
      />

      <ReflectionEngagementActions
        groupId={groupId}
        reflectionId={reflectionId}
        initialIsLiked={data.isLiked}
        initialLikeCount={data.likes}
        initialCommentCount={data.comments}
        onCommentClick={() => setIsCommentSheetOpen(true)}
      />

      <CommentBottomSheet
        isOpen={isCommentSheetOpen}
        onClose={() => setIsCommentSheetOpen(false)}
        groupId={groupId}
        reflectionId={reflectionId}
      />
    </>
  );
};

export default FriendReflectionDetail;
