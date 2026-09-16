'use client';

import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';

import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import { CALENDAR_DATE_FORMAT } from '@/src/lib/constants/calendar';

import { useGroupMemberCalendarQuery } from '../../queries/useGroupMemberCalendarQuery';
import FriendCalendarSheet from '../FriendCalendarSheet/FriendCalendarSheet';
import FriendReflectionDateNav from '../FriendReflectionDateNav/FriendReflectionDateNav';
import FriendReflectionDetail from '../FriendReflectionDetail/FriendReflectionDetail';

interface FriendReflectionContentProps {
  groupId: number;
  userId: number;
}

const FriendReflectionContent = ({
  groupId,
  userId,
}: FriendReflectionContentProps) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data, isPending, isError } = useGroupMemberCalendarQuery({
    groupId,
    userId,
    month: format(selectedDate, CALENDAR_DATE_FORMAT.monthRequest),
  });

  const reflectionByDate = useMemo(() => {
    const mapped = new Map<string, NonNullable<typeof data>[number]>();

    for (const reflection of data ?? []) {
      mapped.set(reflection.reflectedAt.slice(0, 10), reflection);
    }

    return mapped;
  }, [data]);

  const selectedReflection = reflectionByDate.get(
    format(selectedDate, CALENDAR_DATE_FORMAT.dayKey),
  );

  const goPrevDate = () => setSelectedDate((date) => addDays(date, -1));
  const goNextDate = () => setSelectedDate((date) => addDays(date, 1));

  const renderReflection = () => {
    if (isPending) {
      return (
        <div className="space-y-5">
          <Skeleton className="h-6 w-24" ariaLabel="회고 불러오는 중" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      );
    }

    if (isError) {
      return (
        <ErrorState
          title="회고를 불러오지 못했어요."
          description="잠시 후 다시 시도해주세요."
        />
      );
    }

    if (!selectedReflection || !selectedReflection.isPublic) {
      return (
        <section className="flex h-40 flex-col items-center justify-center gap-1">
          <p className="font-body-s text-g-0">
            {selectedReflection ? '비공개 회고예요' : '이 날에는 회고가 없어요'}
          </p>
          <p className="font-caption-n text-g-80">다른 날짜를 확인해 보세요</p>
        </section>
      );
    }

    return (
      <FriendReflectionDetail
        groupId={groupId}
        reflectionId={selectedReflection.id}
      />
    );
  };

  return (
    <div className="space-y-3">
      <FriendReflectionDateNav
        selectedDate={selectedDate}
        isNextDisabled={isSameDay(selectedDate, today)}
        onPrevDate={goPrevDate}
        onNextDate={goNextDate}
        onOpenCalendar={() => setIsCalendarOpen(true)}
      />

      {renderReflection()}

      <FriendCalendarSheet
        isOpen={isCalendarOpen}
        groupId={groupId}
        userId={userId}
        selectedDate={selectedDate}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={setSelectedDate}
      />
    </div>
  );
};

export default FriendReflectionContent;
