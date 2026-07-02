import type { GraphPeriod } from '../constants/graphPeriod';

function subtractMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const day = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() - months);

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(day, lastDay));

  return result;
}

export function filterByPeriod(
  dataPoints: Array<{ score: number; createdAt: Date }>,
  period: GraphPeriod,
) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let cutoff: Date;
  switch (period) {
    case 'WEEK':
      cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 7);
      break;
    case 'MONTH':
      cutoff = subtractMonths(now, 1);
      break;
    case 'THREE_MONTHS':
      cutoff = subtractMonths(now, 3);
      break;
    case 'SIX_MONTHS':
      cutoff = subtractMonths(now, 6);
      break;
    case 'YEAR':
      cutoff = subtractMonths(now, 12);
      break;
  }

  return dataPoints.filter((dp) => new Date(dp.createdAt) >= cutoff);
}
