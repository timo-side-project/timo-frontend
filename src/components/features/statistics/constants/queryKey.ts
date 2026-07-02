export const STATISTICS_QUERY_KEYS = {
  statistics: ['statistics'] as const,
  detail: (category: string) => ['statistics', 'detail', category] as const,
};
