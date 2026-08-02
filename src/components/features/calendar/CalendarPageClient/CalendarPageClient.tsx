'use client';

import { Suspense, useState } from 'react';

import CalendarMonth from '@/src/components/features/calendar/CalendarMonth/CalendarMonth';
import CalendarPageFallback from '@/src/components/features/calendar/CalendarPageFallback/CalendarPageFallback';
import { useCalendarState } from '@/src/components/features/calendar/hooks/useCalendarState';
import StreakBanner from '@/src/components/features/calendar/StreakBanner/StreakBanner';
import SummaryCard from '@/src/components/features/calendar/SummaryCard/SummaryCard';
import { reflectionKeys } from '@/src/components/features/reflection/constants/queryKeys';
import { userKeys } from '@/src/components/features/users/constants/queryKeys';
import BottomNavBar from '@/src/components/layout/BottomNavBar/BottomNavBar';
import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import PullToRefresh from '@/src/components/ui/PullToRefresh/PullToRefresh';

export interface SelectedSummaryCardData {
  questionText: string;
  reflectionText: string;
  reflectionId: number | null;
}

const CalendarPageClient = () => {
  const calendarState = useCalendarState();
  const [selectedSummary, setSelectedSummary] =
    useState<SelectedSummaryCardData | null>(null);

  return (
    <div className="space-y-5 pb-28">
      <PageHeader title="캘린더" />
      <PullToRefresh
        queryKeys={[reflectionKeys.all, userKeys.all]}
        className="space-y-5"
      >
        <Suspense
          fallback={
            <CalendarPageFallback
              currentMonthLabel={calendarState.currentMonthLabel}
            />
          }
        >
          <StreakBanner />
          <CalendarMonth
            {...calendarState}
            onSelectSummary={setSelectedSummary}
          />
          <SummaryCard selectedSummary={selectedSummary} />
        </Suspense>
      </PullToRefresh>
      {/* TODO: 바뀐 디자인 반영 확인 해야 함 */}
      <BottomNavBar />
    </div>
  );
};

export default CalendarPageClient;
