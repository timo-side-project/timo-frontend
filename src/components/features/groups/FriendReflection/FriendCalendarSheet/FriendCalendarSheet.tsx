'use client';

import { format } from 'date-fns';
import { useMemo } from 'react';

import BottomSheet from '@/src/components/ui/BottomSheet/BottomSheet';
import Button from '@/src/components/ui/Button/Button';
import Calendar from '@/src/components/ui/Calendar/Calendar';
import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
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
  selectedDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

const FriendCalendarSheet = ({
  isOpen,
  groupId,
  userId,
  selectedDate,
  onClose,
  onSelectDate,
}: FriendCalendarSheetProps) => {
  const calendarState = useCalendarState({ initialDate: selectedDate });

  const { data, isPending, isError, refetch } = useGroupMemberCalendarQuery({
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
          : { categoryType: 'private', isDisabled: true },
      );
    }

    return marks;
  }, [data]);

  const handleSelectDate = (date: Date) => {
    calendarState.selectDate(date);
    onSelectDate(date);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} ariaLabel="회고 날짜 선택">
      {isPending ? (
        <Skeleton className="h-80 w-full" ariaLabel="캘린더 불러오는 중" />
      ) : isError ? (
        <div className="flex flex-col items-center gap-6 py-10">
          <ErrorState
            title="캘린더를 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
          />
          <Button
            label="다시 시도"
            onClick={() => refetch()}
            variant="secondary"
          />
        </div>
      ) : (
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
      )}
    </BottomSheet>
  );
};

export default FriendCalendarSheet;
