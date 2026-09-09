'use client';

import Detail from '@/src/components/features/reflectionDetail/Detail/Detail';
import { useUserDetailQuery } from '@/src/components/features/users/queries/useUserDetailQuery';

import { useReflectionPrivateState } from '../../hooks/useReflectionPrivateState';
import type { ReflectionDetail } from '../../queries/useReflectionDetailQuery';
import CommentBottomSheet from '../../ReflectionEngagement/CommentBottomSheet/CommentBottomSheet';
import ReflectionEngagementActions from '../../ReflectionEngagement/ReflectionEngagementActions/ReflectionEngagementActions';
import FriendReflectionHeader from '../FriendReflectionHeader/FriendReflectionHeader';

interface ReflectionContentProps {
  groupId: number;
  reflectionId: number;
  data: ReflectionDetail;
  isCommentSheetOpen: boolean;
  onCommentClick: () => void;
  onCommentSheetClose: () => void;
}

const ReflectionContent = ({
  groupId,
  reflectionId,
  data,
  isCommentSheetOpen,
  onCommentClick,
  onCommentSheetClose,
}: ReflectionContentProps) => {
  const { data: user } = useUserDetailQuery();
  const isMine = user?.name === data.nickname;

  const {
    isPrivate,
    toggle: togglePrivate,
    isToggling: isTogglingPrivate,
  } = useReflectionPrivateState({
    groupId,
    reflectionId,
    initialIsPrivate: data.isPrivate,
  });

  return (
    <>
      <FriendReflectionHeader
        privacyToggle={
          isMine
            ? {
                isPrivate,
                onToggle: togglePrivate,
                isToggling: isTogglingPrivate,
              }
            : undefined
        }
      />

      <Detail
        questionCategory={data.question.category}
        questionContent={data.question.content}
        answerContent={data.content}
        friendNickname={isMine ? undefined : data.nickname}
      />

      <ReflectionEngagementActions
        groupId={groupId}
        reflectionId={reflectionId}
        initialIsLiked={data.isLiked}
        initialLikeCount={data.likes}
        initialCommentCount={data.comments}
        onCommentClick={onCommentClick}
      />

      <CommentBottomSheet
        isOpen={isCommentSheetOpen}
        onClose={onCommentSheetClose}
        groupId={groupId}
        reflectionId={reflectionId}
      />
    </>
  );
};

export default ReflectionContent;
