import type {
  CalendarDayCategoryType,
  CalendarDayMark,
} from '@/src/types/calendar';

import type { ReflectionCategoryItem } from './mapReflectionItems';

const CATEGORY_TO_CELL_TYPE: Record<string, CalendarDayCategoryType> = {
  PAST_NEGATIVE: 'past-negative',
  PAST_POSITIVE: 'past-positive',
  PRESENT_HEDONISTIC: 'present-hedonistic',
  PRESENT_FATALISTIC: 'present-fatalistic',
  FUTURE: 'future-oriented',
};

/**
 * 회고 목록을 날짜별 카테고리 타입 맵으로 변환
 * key는 `yyyy-MM-dd` 형식이며, value는 카테고리/회고 ID 정보
 */
export const getCategoryTypeByDate = (
  data: ReflectionCategoryItem[],
): Map<string, CalendarDayMark> => {
  const categoryTypeByDate = new Map<string, CalendarDayMark>();

  for (const { category, reflectedAt } of data) {
    const type = CATEGORY_TO_CELL_TYPE[category];
    if (!type) continue;

    const dateKey = reflectedAt.slice(0, 10);
    categoryTypeByDate.set(dateKey, { categoryType: type });
  }

  return categoryTypeByDate;
};
