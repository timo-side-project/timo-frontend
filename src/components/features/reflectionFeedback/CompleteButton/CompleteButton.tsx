'use client';

import { useRouter } from 'next/navigation';

import Button from '@/src/components/ui/Button/Button';

import { useRewardUnlock } from '../../reward/hooks/useRewardUnlock';
import RewardUnlockFlow from '../../reward/RewardUnlockFlow/RewardUnlockFlow';

const CompleteButton = () => {
  const router = useRouter();
  const goHome = () => router.push('/');
  const { unlockedItems, isChecking, start } = useRewardUnlock(goHome);

  if (unlockedItems) {
    return <RewardUnlockFlow items={unlockedItems} onComplete={goHome} />;
  }

  return <Button label="완료" onClick={start} disabled={isChecking} />;
};

export default CompleteButton;
