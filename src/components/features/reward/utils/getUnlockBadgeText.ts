import type { UnlockConditionType } from '../queries/useRecentlyUnlockedCustomizationsQuery';

export const getUnlockBadgeText = (
  unlockConditionType: UnlockConditionType,
  unlockConditionCount: number,
): string => {
  switch (unlockConditionType) {
    case 'TOTAL_COUNT':
      return `회고 ${unlockConditionCount}회 달성!`;
    case 'STREAK_COUNT':
      return `${unlockConditionCount}일 연속 회고 달성!`;
  }
};
