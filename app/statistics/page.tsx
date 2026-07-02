import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

import StatisticsDetail from '@/src/components/features/statistics/StatisticsDetail/StatisticsDetail';
import BottomNavBar from '@/src/components/layout/BottomNavBar/BottomNavBar';
import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';

const StatisticsPage = () => {
  return (
    <div className="flex flex-col min-h-dvh">
      <PageHeader title="시간관 변화" />
      <Suspense fallback={<Skeleton />}>
        <StatisticsDetail />
      </Suspense>
      <BottomNavBar />
    </div>
  );
};

export default StatisticsPage;
