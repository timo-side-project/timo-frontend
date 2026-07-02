export const GRAPH_PERIOD_OPTIONS = [
  { label: '1주', value: 'WEEK' },
  { label: '1달', value: 'MONTH' },
  { label: '3달', value: 'THREE_MONTHS' },
  { label: '6달', value: 'SIX_MONTHS' },
  { label: '1년', value: 'YEAR' },
] as const;

export type GraphPeriod = (typeof GRAPH_PERIOD_OPTIONS)[number]['value'];

export const PERIOD_START_LABEL: Record<GraphPeriod, string> = {
  WEEK: '1주 전',
  MONTH: '1달 전',
  THREE_MONTHS: '3달 전',
  SIX_MONTHS: '6달 전',
  YEAR: '1년 전',
};
