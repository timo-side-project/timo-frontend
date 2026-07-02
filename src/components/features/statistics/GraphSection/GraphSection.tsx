import { useState } from 'react';

import SortSelect from '@/src/components/ui/SortSelect/SortSelect';
import type { CATEGORY, CHARACTER_NAMES } from '@/src/lib/constants/character';

import {
  GRAPH_PERIOD_OPTIONS,
  type GraphPeriod,
  PERIOD_START_LABEL,
} from '../constants/graphPeriod';
import DataGraph from '../DataGraph/DataGraph';
import { useStatisticsDetailQuery } from '../queries/useStatisticsDetailQuery';
import { filterByPeriod } from '../utils/filterByPeriod';

interface GraphSectionProps {
  character: (typeof CHARACTER_NAMES)[number];
  category: (typeof CATEGORY)[number];
}

const GraphSection = ({ character, category }: GraphSectionProps) => {
  const { data } = useStatisticsDetailQuery(category);
  const [period, setPeriod] = useState<GraphPeriod>(
    GRAPH_PERIOD_OPTIONS[0].value,
  );

  const approachRate = data.proximityRate ?? 0;
  const filteredDataPoints = filterByPeriod(data.dataPoints, period);

  return (
    <section className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <p className="font-heading-h4 text-g-0">{character} 그래프</p>
        <SortSelect
          options={GRAPH_PERIOD_OPTIONS}
          value={period}
          onChange={setPeriod}
        />
      </div>

      <DataGraph
        dataPoints={filteredDataPoints}
        idealScore={data.idealScore}
        startLabel={PERIOD_START_LABEL[period]}
        chartType={
          ['THREE_MONTHS', 'SIX_MONTHS', 'YEAR'].includes(period)
            ? 'line'
            : 'bar'
        }
      />

      <article className="flex flex-col gap-5">
        {approachRate === 0 ? (
          <p className="text-g-60">
            아직 이상치와의 거리가 좁혀지지 않았어요.
            <br />
            회고를 꾸준히 이어가 보세요!
          </p>
        ) : (
          <p className="font-heading-h4 text-g-60">
            회고를 통해서{' '}
            <span className="text-primary">{Math.round(approachRate)}%</span>{' '}
            이상치에 가까워졌어요!
          </p>
        )}
      </article>
    </section>
  );
};

export default GraphSection;
