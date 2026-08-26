'use client';

import CalendarGrid from '@/src/components/ui/Calendar/CalendarGrid/CalendarGrid';
import CalendarHeader from '@/src/components/ui/Calendar/CalendarHeader/CalendarHeader';
import CalendarWeekdays from '@/src/components/ui/Calendar/CalendarWeekdays/CalendarWeekdays';
import type { CalendarDayRecordByDateItem } from '@/src/types/calendar';

interface CalendarProps {
  currentMonthLabel: string;
  days: Date[];
  currentMonth: Date;
  today: Date;
  selectedDate: Date | null;
  /** 'yyyy-MM-dd' 키로 조회하는 날짜별 표시 정보 */
  marksByDate: Map<string, CalendarDayRecordByDateItem>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
}

const Calendar = ({
  currentMonthLabel,
  days,
  currentMonth,
  today,
  selectedDate,
  marksByDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: CalendarProps) => {
  return (
    <div className="space-y-3">
      <CalendarHeader
        currentMonthLabel={currentMonthLabel}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />

      <CalendarWeekdays />
      <CalendarGrid
        days={days}
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        today={today}
        marksByDate={marksByDate}
        onSelectDate={onSelectDate}
      />
    </div>
  );
};

export default Calendar;
