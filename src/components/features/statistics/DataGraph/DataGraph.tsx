import { calcChartData, type DataPoint } from '../utils/dataGraph';
import BarChart from './BarChart';
import LineChart from './LineChart';

interface DataGraphProps {
  dataPoints: DataPoint[];
  idealScore: number;
  startLabel: string;
  chartType: 'bar' | 'line';
}

const DataGraph = ({
  dataPoints,
  idealScore,
  startLabel,
  chartType,
}: DataGraphProps) => {
  if (dataPoints.length === 0) {
    return (
      <div className="h-38 bg-g-600 rounded-lg flex items-center justify-center">
        <p className="font-caption-n text-g-100">이 기간의 데이터가 없어요</p>
      </div>
    );
  }

  const {
    maxScore,
    endDate,
    idealLineBottomPx,
    showDots,
    points,
    polylineStr,
    areaPath,
    labelIndices,
  } = calcChartData(dataPoints, idealScore);

  return (
    <div className="relative h-38 bg-g-600 rounded-lg overflow-hidden">
      {/* 이상치 기준선 */}
      <div className="absolute inset-x-4 top-3 bottom-8 pointer-events-none">
        <div
          className="absolute inset-x-0 border-t border-dashed border-g-60/40"
          style={{ bottom: idealLineBottomPx }}
        />
      </div>

      {chartType === 'bar' ? (
        <BarChart
          dataPoints={dataPoints}
          maxScore={maxScore}
          idealScore={idealScore}
          startLabel={startLabel}
          endDate={endDate}
        />
      ) : (
        <LineChart
          dataPoints={dataPoints}
          idealScore={idealScore}
          points={points}
          polylineStr={polylineStr}
          areaPath={areaPath}
          showDots={showDots}
          labelIndices={labelIndices}
        />
      )}
    </div>
  );
};

export default DataGraph;
