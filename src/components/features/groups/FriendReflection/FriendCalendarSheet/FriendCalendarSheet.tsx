'use client';

import { format } from 'date-fns';
import { useMemo, useState } from 'react';

import BottomSheet from '@/src/components/ui/BottomSheet/BottomSheet';
import Calendar from '@/src/components/ui/Calendar/Calendar';
import { useCalendarState } from '@/src/hooks/useCalendarState';
import {
  CALENDAR_DATE_FORMAT,
  CATEGORY_TO_CALENDAR_DAY_TYPE,
} from '@/src/lib/constants/calendar';
import type { CalendarDayMark } from '@/src/types/calendar';

import { useGroupMemberCalendarQuery } from '../../queries/useGroupMemberCalendarQuery';

interface FriendCalendarSheetProps {
  isOpen: boolean;
  groupId: number;
  userId: number;
  isMyPage: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

const FriendCalendarSheet = ({
  isOpen,
  groupId,
  userId,
  isMyPage,
  selectedDate,
  onClose,
  onSelectDate,
}: FriendCalendarSheetProps) => {
  const calendarState = useCalendarState({ initialDate: selectedDate });

  // 날짜를 고르지 않고 닫았다가 다시 열면 보고 있던 날짜의 달로 되돌린다
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);

    if (isOpen) {
      calendarState.reset();
    }
  }

  const { data } = useGroupMemberCalendarQuery({
    groupId,
    userId,
    month: format(
      calendarState.currentMonth,
      CALENDAR_DATE_FORMAT.monthRequest,
    ),
  });

  const marksByDate = useMemo(() => {
    const marks = new Map<string, CalendarDayMark>();

    for (const reflection of data ?? []) {
      const dateKey = reflection.reflectedAt.slice(0, 10);

      marks.set(
        dateKey,
        reflection.isPublic
          ? {
              categoryType:
                CATEGORY_TO_CALENDAR_DAY_TYPE[reflection.question.category],
            }
          : { categoryType: 'private', isDisabled: !isMyPage },
      );
    }

    return marks;
  }, [data, isMyPage]);

  const handleSelectDate = (date: Date) => {
    calendarState.selectDate(date);
    onSelectDate(date);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} ariaLabel="회고 날짜 선택">
      <Calendar
        currentMonthLabel={calendarState.currentMonthLabel}
        days={calendarState.days}
        currentMonth={calendarState.currentMonth}
        today={calendarState.today}
        selectedDate={calendarState.selectedDate}
        marksByDate={marksByDate}
        emptyVariant="none"
        onPrevMonth={calendarState.goPrevMonth}
        onNextMonth={calendarState.goNextMonth}
        onSelectDate={handleSelectDate}
      />
    </BottomSheet>
  );
};

export default FriendCalendarSheet;
