'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useRecentlyUnlockedCustomizationsQuery } from '@/src/components/features/reward/queries/useRecentlyUnlockedCustomizationsQuery';
import RewardUnlockFlow from '@/src/components/features/reward/RewardUnlockFlow/RewardUnlockFlow';

const RewardPage = () => {
  const router = useRouter();
  const { data, isPending } = useRecentlyUnlockedCustomizationsQuery();

  const goHome = () => router.push('/');

  const hasNoReward = !isPending && (!data || data.length === 0);

  // 테마를 항상 마지막에 배치 — '보러가기'(테마 전용)를 플로우 끝에서만 노출
  const sortedItems = useMemo(
    () =>
      data
        ? [...data].sort((a, b) =>
            a.type === 'THEME' ? 1 : b.type === 'THEME' ? -1 : 0,
          )
        : data,
    [data],
  );

  useEffect(() => {
    if (hasNoReward) {
      router.replace('/');
    }
  }, [hasNoReward, router]);

  if (!sortedItems || sortedItems.length === 0) {
    return null;
  }

  return <RewardUnlockFlow items={sortedItems} onComplete={goHome} />;
};

export default RewardPage;
