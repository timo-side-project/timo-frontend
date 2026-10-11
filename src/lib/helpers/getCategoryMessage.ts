import {
  CATEGORY_MESSAGE_MAP,
  type CategoryMessageParts,
} from '@/src/lib/constants/categoryMessages';
import type { Category } from '@/src/lib/constants/character';

export const getCategoryMessage = (
  category: Category,
): CategoryMessageParts => {
  return (
    CATEGORY_MESSAGE_MAP[category] ??
    '오늘은 나를 차분하게 돌아보는 시간을 가졌어요.'
  );
};
