import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

import { STATISTICS_QUERY_KEYS } from '@/src/components/features/statistics/constants/queryKey';
import StatisticsDetail from '@/src/components/features/statistics/StatisticsDetail/StatisticsDetail';
import BottomNavBar from '@/src/components/layout/BottomNavBar/BottomNavBar';
import PageHeader from '@/src/components/layout/PageHeader/PageHeader';
import PullToRefresh from '@/src/components/ui/PullToRefresh/PullToRefresh';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';

const StatisticsPage = () => {
  return (
    <div className="flex flex-col min-h-dvh">
      <PageHeader title="시간관 변화" />
      <PullToRefresh
        queryKeys={[STATISTICS_QUERY_KEYS.statistics]}
        className="flex flex-1 flex-col"
      >
        <Suspense fallback={<Skeleton />}>
          <StatisticsDetail />
        </Suspense>
      </PullToRefresh>
      <BottomNavBar />
    </div>
  );
};

export default StatisticsPage;
