import { cn } from '@/src/lib/helpers/cn';

import {
  CHART_AREA_HEIGHT,
  type DataPoint,
  formatDate,
  MAX_BAR_WIDTH,
} from '../utils/dataGraph';

interface BarChartProps {
  dataPoints: DataPoint[];
  maxScore: number;
  idealScore: number;
  startLabel: string;
  endDate: Date;
}

const BarChart = ({
  dataPoints,
  maxScore,
  idealScore,
  startLabel,
  endDate,
}: BarChartProps) => {
  return (
    <>
      <div className="absolute inset-x-4 top-3 bottom-8">
        <div className="absolute inset-0 flex items-end gap-0.5">
          {dataPoints.map((dp, i) => {
            const heightPx = Math.round(
              (dp.score / maxScore) * CHART_AREA_HEIGHT,
            );
            return (
              <div
                key={i}
                className={cn(
                  'flex-1 min-w-0 rounded-t-xs',
                  dp.score >= idealScore ? 'bg-g-60' : 'bg-g-200',
                )}
                style={{ height: heightPx, maxWidth: MAX_BAR_WIDTH }}
              />
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-2 flex justify-between">
        <span className="font-caption-n text-g-60 text-[11px]">
          {startLabel}
        </span>
        <span className="font-caption-n text-g-60 text-[11px]">
          {formatDate(endDate)}
        </span>
      </div>
    </>
  );
};

export default BarChart;
