'use client';

import Icon from '@/src/components/ui/Icon/Icon';
import type { IconNameType } from '@/src/components/ui/Icon/Icon.types';
import { cn } from '@/src/lib/helpers/cn';
import type { CalendarDayCategoryType } from '@/src/types/calendar';

interface CalendarDayCellProps {
  day: number;
  categoryType?: CalendarDayCategoryType;
  isFuture?: boolean;
  hasRecord?: boolean;
  isOutlined?: boolean;
  onClick?: () => void;
}

const iconNameMap: Record<CalendarDayCategoryType, IconNameType> = {
  'past-negative': 'calendarDayPastN',
  'past-positive': 'calendarDayPastP',
  'present-hedonistic': 'calendarDayPresentH',
  'present-fatalistic': 'calendarDayPresentF',
  'future-oriented': 'calendarDayFuture',
  slate: 'calendarDaySlate',
};

const CalendarDayCell = ({
  day,
  categoryType,
  isFuture = false,
  hasRecord = false,
  isOutlined = false,
  onClick,
}: CalendarDayCellProps) => {
  const resolvedType = isFuture ? 'slate' : (categoryType ?? 'slate');

  return (
    <button type="button" onClick={onClick} className="relative h-8 w-8">
      {isOutlined ? (
        <Icon
          name="calendarDayOutline"
          decorative
          size={32}
          className="absolute inset-0 scale-110"
        />
      ) : null}
      <Icon
        name={iconNameMap[resolvedType]}
        decorative
        size={32}
        className="absolute inset-0"
      />
      <span
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
