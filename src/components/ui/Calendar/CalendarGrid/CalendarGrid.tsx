'use client';

import CalendarDayCell from '@/src/components/ui/Calendar/CalendarDayCell/CalendarDayCell';
import {
  type CalendarDayCellType,
  getCalendarDayCells,
} from '@/src/lib/helpers/getCalendarDayCells';
import type {
  CalendarDayMark,
  CalendarEmptyDayVariant,
} from '@/src/types/calendar';

interface CalendarGridProps {
  days: Date[];
  currentMonth: Date;
  selectedDate: Date | null;
  today: Date;
  marksByDate: Map<string, CalendarDayMark>;
  emptyVariant?: CalendarEmptyDayVariant;
  onSelectDate: (date: Date) => void;
}

const CalendarGrid = ({
  days,
  currentMonth,
  selectedDate,
  today,
  marksByDate,
  emptyVariant,
  onSelectDate,
}: CalendarGridProps) => {
  const dayCells: CalendarDayCellType[] = getCalendarDayCells({
    days,
    currentMonth,
    selectedDate,
    today,
    marksByDate,
  });

  return (
    <ul className="grid grid-cols-7 gap-y-2">
      {dayCells.map((dayCell) => {
        return (
          <li key={dayCell.key} className="flex justify-center">
            {dayCell.isCurrentMonth ? (
              <CalendarDayCell
                day={dayCell.cellProps.day}
                categoryType={dayCell.categoryType}
                isFuture={dayCell.isFuture}
                hasRecord={dayCell.cellProps.hasRecord}
                isOutlined={dayCell.cellProps.isOutlined}
                isDisabled={dayCell.isDisabled}
                emptyVariant={emptyVariant}
                onClick={() => onSelectDate(dayCell.date)}
              />
            ) : (
              <span aria-hidden className="h-10 w-10" />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default CalendarGrid;
