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

export const useCalendarState = (): UseCalendarStateResult => {
  // 오늘 날짜(초기 렌더에서 한 번만 계산)
  const today = useMemo(() => new Date(), []);

  // 캘린더 기준 월(오늘이 속한 달의 1일)
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(today));

  // 사용자가 선택한 날짜 (없으면 null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
