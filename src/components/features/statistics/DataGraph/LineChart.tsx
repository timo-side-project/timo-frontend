import { cn } from '@/src/lib/helpers/cn';

import {
  AREA_GRADIENT_ID,
  type ChartPoint,
  type DataPoint,
  formatShortDate,
} from '../utils/dataGraph';

interface LineChartProps {
  dataPoints: DataPoint[];
  idealScore: number;
  points: ChartPoint[];
  polylineStr: string;
  areaPath: string;
  showDots: boolean;
  labelIndices: number[];
}

const LineChart = ({
  dataPoints,
  idealScore,
  points,
  polylineStr,
  areaPath,
  showDots,
  labelIndices,
}: LineChartProps) => {
  return (
    <>
      <div className="absolute inset-x-4 top-3 bottom-8">
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <linearGradient id={AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-g-60)"
                  stopOpacity="0.25"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-g-60)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {areaPath && (
              <path d={areaPath} fill={`url(#${AREA_GRADIENT_ID})`} />
            )}

            {points.length >= 2 && (
              <polyline
                points={polylineStr}
                fill="none"
                stroke="var(--color-g-60)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
          </svg>

          {showDots &&
            points.map(({ x, y, dp }, i) => (
              <div
                key={i}
                className={cn(
                  'absolute size-1.5 rounded-full -translate-x-1/2 -translate-y-1/2',
                  dp.score >= idealScore ? 'bg-g-60' : 'bg-g-200',
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            ))}
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-2">
        <div className="relative h-4">
          {labelIndices.map((idx) => {
            const isFirst = idx === 0;
            const isLast = idx === dataPoints.length - 1;
            const isSingle = dataPoints.length === 1;
            const xPercent = isSingle
              ? 50
              : isFirst
                ? 0
                : isLast
                  ? 100
                  : (idx / (dataPoints.length - 1)) * 100;
            return (
              <span
                key={idx}
                className={cn(
                  'absolute text-[10px] text-g-60 whitespace-nowrap',
                  isSingle && 'left-1/2 -translate-x-1/2',
                  !isSingle && isFirst && 'left-0',
                  !isSingle && isLast && 'right-0',
                  !isSingle && !isFirst && !isLast && '-translate-x-1/2',
                )}
                style={
                  isSingle || (!isFirst && !isLast)
                    ? { left: `${xPercent}%` }
                    : undefined
                }
              >
                {formatShortDate(dataPoints[idx].createdAt)}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LineChart;
