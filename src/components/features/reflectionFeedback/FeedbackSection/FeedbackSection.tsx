'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import BottomCTA from '@/src/components/layout/BottomCTA/BottomCTA';
import Button from '@/src/components/ui/Button/Button';
import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import { goToHome } from '@/src/lib/helpers/navigation';

import { useTodayReflectionQuery } from '../../reflection/queries/useTodayReflectionQuery';
import { useUserDetailQuery } from '../../users/queries/useUserDetailQuery';
import CompleteAction from '../CompleteAction/CompleteAction';
import GeneratingFeedbackCard from '../GeneratingFeedbackCard/GeneratingFeedbackCard';
import { useReflectionFeedbackDetailQuery } from '../queries/useReflectionFeedbackDetailQuery';
import ResultCard from '../ResultCard/ResultCard';

const FEEDBACK_TIMEOUT_MS = 10000;

const FeedbackSection = () => {
  const router = useRouter();
  const [isTimedOut, setIsTimedOut] = useState(false);
  const { data, isPending, isError } = useTodayReflectionQuery({
    staleTime: 0,
    refetchOnMount: 'always',
    refetchInterval: (query) => {
      const reflection = query.state.data;
      const feedback = reflection?.feedback;
      const shouldPoll =
        reflection !== null &&
        (!feedback ||
          feedback.status === 'PENDING' ||
          feedback.status === 'PROCESSING');

      return shouldPoll ? 1000 : false;
    },
  });

  const id = data?.id;
  const feedback = data?.feedback;
  const category = data?.question?.category;
  const feedbackContent = feedback?.content;
  const isGenerating =
    isPending ||
    (data !== null &&
      (!feedback ||
        feedback.status === 'PENDING' ||
        feedback.status === 'PROCESSING'));
  const hasCompletedFeedback =
    feedback?.status === 'COMPLETED' && Boolean(feedbackContent);

  const { data: feedbackDetail, isError: isDetailError } =
    useReflectionFeedbackDetailQuery(id, hasCompletedFeedback);
  const { data: userDetail } = useUserDetailQuery();
  const streakDays = userDetail?.streakDays ?? 0;
  const isDetailLoading =
    hasCompletedFeedback && !feedbackDetail && !isDetailError;
  const isFeedbackLoading = isGenerating || isDetailLoading;
  const hasError =
    isError ||
    isTimedOut ||
    isDetailError ||
    feedback?.status === 'FAILED' ||
    !hasCompletedFeedback ||
    !category;

  useEffect(() => {
    if (!isFeedbackLoading || isTimedOut) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsTimedOut(true);
    }, FEEDBACK_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isFeedbackLoading, isTimedOut]);

  if (isFeedbackLoading) {
    return (
      <>
        <GeneratingFeedbackCard />
        <BottomCTA>
          <Button label="피드백 생성 중..." disabled />
        </BottomCTA>
      </>
    );
  }

  if (hasError) {
    return (
      <ErrorState
        title="피드백을 불러오지 못했어요"
        description="잠시 후 다시 확인해 주세요."
        retryLabel="홈으로 돌아가기"
        onRetry={() => goToHome(router)}
      />
    );
  }

  if (!feedbackContent || !category || !feedbackDetail) {
    return (
      <ErrorState
        title="피드백을 불러오지 못했어요"
        description="잠시 후 다시 확인해 주세요."
        retryLabel="홈으로 돌아가기"
        onRetry={() => goToHome(router)}
      />
    );
  }

  return (
    <section>
      <ResultCard
        feedback={feedbackContent}
        category={category}
        changedScore={feedbackDetail.changedScore}
        isIncreased={feedbackDetail.isIncreased}
        streakDays={streakDays}
      />
      <BottomCTA>
        <div className="flex w-full flex-col gap-2.5">
          <CompleteAction />
          <Button
            label="변화보기"
            variant="secondary"
            onClick={() => router.push('/statistics')}
          />
        </div>
      </BottomCTA>
    </section>
  );
};

export default FeedbackSection;
