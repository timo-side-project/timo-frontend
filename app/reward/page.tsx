'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useRecentlyUnlockedCustomizationsQuery } from '@/src/components/features/reward/queries/useRecentlyUnlockedCustomizationsQuery';
import RewardUnlockFlow from '@/src/components/features/reward/RewardUnlockFlow/RewardUnlockFlow';

const RewardPage = () => {
  const router = useRouter();
  const { data, isPending } = useRecentlyUnlockedCustomizationsQuery();

  const goHome = () => router.push('/');

  const hasNoReward = !isPending && (!data || data.length === 0);

  useEffect(() => {
    if (hasNoReward) {
      router.replace('/');
    }
  }, [hasNoReward, router]);

  if (!data || data.length === 0) {
    return null;
  }

  return <RewardUnlockFlow items={data} onComplete={goHome} />;
};

export default RewardPage;
