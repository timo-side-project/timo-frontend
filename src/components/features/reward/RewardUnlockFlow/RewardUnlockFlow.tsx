'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/src/hooks/useToast';

import { useEquipCustomizationMutation } from '../queries/useEquipCustomizationMutation';
import type { UnlockedCustomizationItem } from '../queries/useRecentlyUnlockedCustomizationsQuery';
import RewardAcquireScreen from '../RewardAcquireScreen/RewardAcquireScreen';
import RewardResultModal from '../RewardResultModal/RewardResultModal';
import { getUnlockBadgeText } from '../utils/getUnlockBadgeText';

type Phase = 'acquire' | 'applied' | 'saved';

interface RewardUnlockFlowProps {
  items: UnlockedCustomizationItem[];
  onComplete: () => void;
}

const RewardUnlockFlow = ({ items, onComplete }: RewardUnlockFlowProps) => {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('acquire');
  const { mutateAsync: equip, isPending } = useEquipCustomizationMutation();
  const { showToast } = useToast();
  const router = useRouter();

  const current = items[index];
  if (!current) {
    return null;
  }

  const goNext = () => {
    const nextIndex = index + 1;
    if (nextIndex >= items.length) {
      onComplete();
      return;
    }
    setIndex(nextIndex);
    setPhase('acquire');
  };

  const handleApply = async () => {
    if (isPending) {
      return;
    }

    try {
      await equip(current.id);
      setPhase('applied');
    } catch {
      showToast({ message: '적용에 실패했어요.' });
    }
  };

  const handleSave = () => setPhase('saved');

  // TODO(#193): 보러가기 목적지 경로 확인 필요 (/profile/theme)
  const handleView = () => router.push('/profile/theme');

  const isTheme = current.type === 'THEME';
  const subject = isTheme ? current.name : '나의 캐릭터 펫';
  const acquireSuffix = isTheme ? '를 획득했습니다!' : '을 획득했습니다!';

  if (phase === 'acquire') {
    return (
      <RewardAcquireScreen
        badgeText={getUnlockBadgeText(
          current.unlockConditionType,
          current.unlockConditionCount,
        )}
        rewardName={subject}
        suffix={acquireSuffix}
        imageSrc={current.image}
        onApply={handleApply}
        onSave={handleSave}
      />
    );
  }

  const isApplied = phase === 'applied';
  const actionLabel = isApplied ? '적용' : '저장';

  return (
    <RewardResultModal
      isOpen
      onClose={goNext}
      title={`${subject} ${actionLabel} 완료`}
      description={`${subject} ${actionLabel}이 완료되었습니다`}
      imageSrc={isApplied ? current.image : undefined}
      onView={
        index === items.length - 1 && !isApplied && isTheme
          ? handleView
          : undefined
      }
    />
  );
};

export default RewardUnlockFlow;
