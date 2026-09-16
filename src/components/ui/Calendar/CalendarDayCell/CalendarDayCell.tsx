'use client';

import Icon from '@/src/components/ui/Icon/Icon';
import type { IconNameType } from '@/src/components/ui/Icon/Icon.types';
import { cn } from '@/src/lib/helpers/cn';
import type {
  CalendarDayCategoryType,
  CalendarEmptyDayVariant,
} from '@/src/types/calendar';

interface CalendarDayCellProps {
  day: number;
  dateLabel: string;
  categoryType?: CalendarDayCategoryType;
  isFuture?: boolean;
  hasRecord?: boolean;
  isOutlined?: boolean;
  isDisabled?: boolean;
  emptyVariant?: CalendarEmptyDayVariant;
  onClick?: () => void;
}

const iconNameMap: Record<CalendarDayCategoryType, IconNameType> = {
  'past-negative': 'calendarDayPastN',
  'past-positive': 'calendarDayPastP',
  'present-hedonistic': 'calendarDayPresentH',
  'present-fatalistic': 'calendarDayPresentF',
  'future-oriented': 'calendarDayFuture',
  slate: 'calendarDaySlate',
  private: 'calendarDayPrivate',
};

const CalendarDayCell = ({
  day,
  dateLabel,
  categoryType,
  isFuture = false,
  hasRecord = false,
  isOutlined = false,
  isDisabled = false,
  emptyVariant = 'slate',
  onClick,
}: CalendarDayCellProps) => {
  // 마크가 없는 날짜는 emptyVariant에 따라 회색 배경을 깔거나 숫자만 남긴다
  const resolvedType =
    emptyVariant === 'slate'
      ? isFuture
        ? 'slate'
        : (categoryType ?? 'slate')
      : categoryType;

  // 아웃라인은 배경 아이콘 뒤에 깔리는 흰 덩어리라, 배경이 없으면 그리지 않는다
  const showOutline = isOutlined && resolvedType !== undefined;

  const recordLabel =
    categoryType === 'private'
      ? '비공개 회고'
      : hasRecord
        ? '회고 있음'
        : '회고 없음';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={`${dateLabel} ${recordLabel}`}
      className="relative h-8 w-8"
    >
      {showOutline ? (
        <Icon
          name="calendarDayOutline"
          decorative
          size={32}
          className="absolute inset-0 scale-110"
        />
      ) : null}
      {resolvedType ? (
        <Icon
          name={iconNameMap[resolvedType]}
          decorative
          size={32}
          className="absolute inset-0"
        />
      ) : null}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 flex items-center justify-center font-body-s',
          hasRecord ? 'text-g-900' : 'text-g-200',
        )}
      >
        {day}
      </span>
    </button>
  );
};

export default CalendarDayCell;
