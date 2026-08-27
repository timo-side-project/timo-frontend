'use client';

import Detail from '@/src/components/features/reflectionDetail/Detail/Detail';

import type { GroupFriendItem } from '../queries/useGroupFriendListQuery';

interface FriendReflectionContentProps {
  groupId: number;
  friend: GroupFriendItem;
}

const FriendReflectionContent = ({ friend }: FriendReflectionContentProps) => {
  const { questionCategory, questionContent, answerText, nickname } = friend;

  if (!questionCategory || !questionContent || !answerText) {
    return null;
  }

  return (
    <Detail
      questionCategory={questionCategory}
      questionContent={questionContent}
      answerContent={answerText}
      friendNickname={nickname}
    />
  );
};

export default FriendReflectionContent;
