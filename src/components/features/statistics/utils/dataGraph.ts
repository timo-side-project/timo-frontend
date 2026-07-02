export interface DataPoint {
  score: number;
  createdAt: Date;
}

export interface ChartPoint {
  x: number;
  y: number;
  dp: DataPoint;
}

export interface ChartData {
  maxScore: number;
  endDate: Date;
  idealLineBottomPx: number;
  showDots: boolean;
  points: ChartPoint[];
  polylineStr: string;
  areaPath: string;
  labelIndices: number[];
}

export const CHART_AREA_HEIGHT = 108; // h-38(152px) - top-3(12px) - bottom-8(32px)
const MAX_LABEL_COUNT = 5;
const SHOW_DOTS_THRESHOLD = 30;

export const AREA_GRADIENT_ID = 'stat-area-gradient';
export const MAX_BAR_WIDTH = 36;

export function formatShortDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function formatDate(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function calcMaxScore(idealScore: number, scores: number[]) {
  const maxData = scores.reduce((m, s) => Math.max(m, s), 0);
  return Math.max(idealScore, maxData) * 1.15 || 1;
}

function getLabelIndices(total: number, count: number): number[] {
  if (total <= count) return Array.from({ length: total }, (_, i) => i);
  return Array.from({ length: count }, (_, i) =>
    Math.round((i * (total - 1)) / (count - 1)),
  );
}

export function calcChartData(
  dataPoints: DataPoint[],
  idealScore: number,
): ChartData {
  const maxScore = calcMaxScore(
    idealScore,
    dataPoints.map((d) => d.score),
  );
  const endDate = dataPoints[dataPoints.length - 1].createdAt;
  const idealLineBottomPx = Math.round(
    (idealScore / maxScore) * CHART_AREA_HEIGHT,
  );
  const showDots = dataPoints.length <= SHOW_DOTS_THRESHOLD;

  const points: ChartPoint[] = dataPoints.map((dp, i) => ({
    x: dataPoints.length === 1 ? 50 : (i / (dataPoints.length - 1)) * 100,
    y: (1 - dp.score / maxScore) * 100,
    dp,
  }));

  const polylineStr = points.map(({ x, y }) => `${x},${y}`).join(' ');
  const areaPath =
    points.length >= 2
      ? `M ${points[0].x},${points[0].y} ${points
          .slice(1)
          .map(({ x, y }) => `L ${x},${y}`)
          .join(
            ' ',
          )} L ${points[points.length - 1].x},100 L ${points[0].x},100 Z`
      : '';

  const labelIndices = getLabelIndices(dataPoints.length, MAX_LABEL_COUNT);

  return {
    maxScore,
    endDate,
    idealLineBottomPx,
    showDots,
    points,
    polylineStr,
    areaPath,
    labelIndices,
  };
}
