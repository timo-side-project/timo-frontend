import { CATEGORY_TO_CALENDAR_DAY_TYPE } from '@/src/lib/constants/calendar';
import type { Category } from '@/src/lib/constants/character';
import type { CalendarDayMark } from '@/src/types/calendar';

import type { ReflectionCategoryItem } from './mapReflectionItems';

/**
 * 회고 목록을 날짜별 카테고리 타입 맵으로 변환
 * key는 `yyyy-MM-dd` 형식이며, value는 카테고리/회고 ID 정보
 */
export const getCategoryTypeByDate = (
  data: ReflectionCategoryItem[],
): Map<string, CalendarDayMark> => {
  const categoryTypeByDate = new Map<string, CalendarDayMark>();

  for (const { category, reflectedAt } of data) {
    const type = CATEGORY_TO_CALENDAR_DAY_TYPE[category as Category];
    if (!type) continue;

    const dateKey = reflectedAt.slice(0, 10);
    categoryTypeByDate.set(dateKey, { categoryType: type });
  }

  return categoryTypeByDate;
};
