'use client';

import Detail from '@/src/components/ui/Detail/Detail';

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
  const { isMine } = data;

  const {
    isPublic,
    toggle: togglePublic,
    isToggling: isTogglingPublic,
  } = useReflectionPrivateState({
    groupId,
    reflectionId,
    initialIsPublic: data.isPublic,
  });

  return (
    <>
      <FriendReflectionHeader
        privacyToggle={
          isMine
            ? {
                isPublic,
                onToggle: togglePublic,
                isToggling: isTogglingPublic,
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
