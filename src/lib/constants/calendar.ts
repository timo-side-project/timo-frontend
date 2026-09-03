import type { Category } from '@/src/lib/constants/character';
import type { CalendarDayCategoryType } from '@/src/types/calendar';

export const CALENDAR_GRID_CELL_COUNT = 42;
export const CALENDAR_WEEK_STARTS_ON = 0;

export const CALENDAR_DATE_FORMAT = {
  monthRequest: 'yyyy-MM',
  monthLabel: 'yyyy.MM',
  dayKey: 'yyyy-MM-dd',
  dayLabel: 'yyyy.MM.dd',
  dayAriaLabel: 'M월 d일',
} as const;

/** 회고 카테고리를 캘린더 셀 표시 타입으로 매핑 */
export const CATEGORY_TO_CALENDAR_DAY_TYPE: Record<
  Category,
  CalendarDayCategoryType
> = {
  PAST_NEGATIVE: 'past-negative',
  PAST_POSITIVE: 'past-positive',
  PRESENT_HEDONISTIC: 'present-hedonistic',
  PRESENT_FATALISTIC: 'present-fatalistic',
  FUTURE: 'future-oriented',
};
