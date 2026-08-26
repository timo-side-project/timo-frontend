'use client';

import CalendarHeader from '@/src/components/ui/Calendar/CalendarHeader/CalendarHeader';
import CalendarWeekdays from '@/src/components/ui/Calendar/CalendarWeekdays/CalendarWeekdays';
import Card from '@/src/components/ui/Card/Card';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import { CALENDAR_GRID_CELL_COUNT } from '@/src/lib/constants/calendar';

interface CalendarPageFallbackProps {
  currentMonthLabel?: string;
}

const noop = () => {};

const CalendarPageFallback = ({
  currentMonthLabel,
}: CalendarPageFallbackProps) => {
  return (
    <>
      <Card className="bg-linear-to-r from-y-50 to-primary py-2">
        <Skeleton
          className="h-8 w-full bg-g-300/30"
          ariaLabel="연속 기록 로딩 중"
        />
      </Card>

      <div className="space-y-3">
        <CalendarHeader
          currentMonthLabel={currentMonthLabel ?? ''}
          onPrevMonth={noop}
          onNextMonth={noop}
        />
        <CalendarWeekdays />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: CALENDAR_GRID_CELL_COUNT }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-8 w-8 rounded-full bg-g-500"
              ariaLabel="캘린더 로딩 중"
            />
          ))}
        </div>
      </div>

      <Card className="rounded-2xl bg-g-500 p-5">
        <div className="space-y-4">
          <Skeleton className="h-6 w-4/5" ariaLabel="오늘의 질문 로딩 중" />
          <Skeleton className="h-4 w-full" ariaLabel="오늘의 회고 로딩 중" />
        </div>
      </Card>
    </>
  );
};

export default CalendarPageFallback;
