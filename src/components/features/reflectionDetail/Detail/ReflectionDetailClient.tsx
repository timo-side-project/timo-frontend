'use client';

import Detail from '@/src/components/ui/Detail/Detail';
import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';

import { useReflectionDetail } from '../queries/useReflectionDetail';

interface ReflectionDetailClientProps {
  reflectionId: number;
}

const ReflectionDetailClient = ({
  reflectionId,
}: ReflectionDetailClientProps) => {
  const { data, isPending, isError, refetch } = useReflectionDetail({
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
    <Detail
      questionCategory={data.question.category}
      questionContent={data.question.content}
      answerContent={data.content}
      feedbackContent={data.feedback?.content}
    />
  );
};

export default ReflectionDetailClient;
