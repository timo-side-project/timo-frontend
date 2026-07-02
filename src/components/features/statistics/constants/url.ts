import type { Category } from '@/src/lib/constants/character';

export const STATISTICS_ENDPOINTS = {
  statistics: '/statistics',
  detail: (category: Category) => `/statistics/${category}`,
} as const;
