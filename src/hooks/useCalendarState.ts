'use client';

import {
  addDays,
  addMonths,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useMemo, useState } from 'react';

import {
  CALENDAR_DATE_FORMAT,
  CALENDAR_GRID_CELL_COUNT,
  CALENDAR_WEEK_STARTS_ON,
} from '@/src/lib/constants/calendar';

export interface UseCalendarStateResult {
  today: Date;
  currentMonth: Date;
  currentMonthLabel: string;
  selectedDate: Date | null;
  days: Date[];
  goPrevMonth: () => void;
  goNextMonth: () => void;
  selectDate: (date: Date) => void;
}

interface UseCalendarStateOptions {
  /** 시작 시 선택해 둘 날짜. 없으면 선택 없이 오늘이 속한 달부터 시작 */
  initialDate?: Date;
}

export const useCalendarState = ({
  initialDate,
}: UseCalendarStateOptions = {}): UseCalendarStateResult => {
  // 오늘 날짜(초기 렌더에서 한 번만 계산)
  const today = useMemo(() => new Date(), []);

  // 캘린더 기준 월(시작 날짜가 있으면 그 달, 없으면 이번 달의 1일)
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(initialDate ?? today),
  );

  // 사용자가 선택한 날짜 (없으면 null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate ?? null,
  );

  // 바깥에서 날짜가 바뀌면(예: 친구 회고 날짜 이동) 기준 월과 선택 날짜를 다시 맞춘다
  const [prevInitialDate, setPrevInitialDate] = useState(initialDate);

  if (prevInitialDate?.getTime() !== initialDate?.getTime()) {
    setPrevInitialDate(initialDate);
    setCurrentMonth(startOfMonth(initialDate ?? today));
    setSelectedDate(initialDate ?? null);
  }

  // 헤더에 표시할 월 라벨
  const currentMonthLabel = useMemo(
    () => format(currentMonth, CALENDAR_DATE_FORMAT.monthLabel),
    [currentMonth],
  );

  // 6주 고정 그리드(42칸)를 Date 배열로 생성
  const days = useMemo(() => {
    // 현재 월의 시작일이 속한 주의 시작(일요일)을 계산
    const gridStart = startOfWeek(currentMonth, {
      weekStartsOn: CALENDAR_WEEK_STARTS_ON,
    });

    return Array.from({ length: CALENDAR_GRID_CELL_COUNT }, (_, index) =>
      addDays(gridStart, index),
    );
  }, [currentMonth]);

  const goPrevMonth = () => {
    setCurrentMonth((month) => startOfMonth(addMonths(month, -1)));
    setSelectedDate(null);
  };

  const goNextMonth = () => {
    setCurrentMonth((month) => startOfMonth(addMonths(month, 1)));
    setSelectedDate(null);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return {
    today,
    currentMonth,
    currentMonthLabel,
    selectedDate,
    days,
    goPrevMonth,
    goNextMonth,
    selectDate,
  };
};
