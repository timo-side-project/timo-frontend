'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';

import { useReflectionDetailQuery } from '../../queries/useReflectionDetailQuery';
import FriendReflectionHeader from '../FriendReflectionHeader/FriendReflectionHeader';
import ReflectionContent from './ReflectionContent';

interface FriendReflectionDetailProps {
  groupId: number;
  reflectionId: number;
  children?: ReactNode;
}

const FriendReflectionDetail = ({
  groupId,
  reflectionId,
  children,
}: FriendReflectionDetailProps) => {
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);

  const { data, isPending, isError, refetch } = useReflectionDetailQuery({
    groupId,
    reflectionId,
  });

  if (isPending) {
    return (
      <>
        <FriendReflectionHeader />
        {children}
        <div className="space-y-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10" />
          <Skeleton className="h-40" />
          <Skeleton className="h-30" />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <FriendReflectionHeader />
        {children}
        <ErrorState
          title="회고를 불러오는 데 실패했어요."
          description="잠시 후 다시 시도해주세요."
          onRetry={refetch}
          className="py-15"
        />
      </>
    );
  }

  return (
    <ReflectionContent
      groupId={groupId}
      reflectionId={reflectionId}
      data={data}
      isCommentSheetOpen={isCommentSheetOpen}
      onCommentClick={() => setIsCommentSheetOpen(true)}
      onCommentSheetClose={() => setIsCommentSheetOpen(false)}
    >
      {children}
    </ReflectionContent>
  );
};

export default FriendReflectionDetail;
