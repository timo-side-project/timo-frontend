import { format, isAfter, isSameDay, isSameMonth, startOfDay } from 'date-fns';

import { CALENDAR_DATE_FORMAT } from '@/src/lib/constants/calendar';
import type {
  CalendarDayCategoryType,
  CalendarDayMark,
} from '@/src/types/calendar';

interface GetCalendarDayCellsParams {
  days: Date[];
  currentMonth: Date;
  selectedDate: Date | null;
  today: Date;
  marksByDate: Map<string, CalendarDayMark>;
}

interface CalendarDayCellProps {
  day: number;
  hasRecord: boolean;
  isOutlined: boolean;
}

export interface CalendarDayCellType {
  key: string;
  isCurrentMonth: boolean;
  date: Date;
  isFuture: boolean;
  categoryType: CalendarDayCategoryType | undefined;
  cellProps: CalendarDayCellProps;
}

/**
 * 42칸 캘린더 날짜 배열을 화면 렌더링용 셀 데이터로 변환
 */
export const getCalendarDayCells = ({
  days,
  currentMonth,
  selectedDate,
  today,
  marksByDate,
}: GetCalendarDayCellsParams): CalendarDayCellType[] => {
  const todayStart = startOfDay(today);

  return days.map((day) => {
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
    const dayStart = startOfDay(day);
    const isToday = isSameDay(dayStart, todayStart);
    const isOutlined = selectedDate ? isSelected : isToday;
    const isFuture = isAfter(dayStart, todayStart);
    const dayKey = format(day, CALENDAR_DATE_FORMAT.dayKey);
    const dayMark = marksByDate.get(dayKey);
    const categoryType = dayMark?.categoryType;
    const hasRecord = Boolean(categoryType);

    return {
      key: day.toISOString(),
      isCurrentMonth,
      date: day,
      isFuture,
      categoryType,
      cellProps: {
        day: day.getDate(),
        hasRecord,
        isOutlined,
      },
    };
  });
};
