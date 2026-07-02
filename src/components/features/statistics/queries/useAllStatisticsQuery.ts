import { useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';

import { STATISTICS_QUERY_KEYS } from '../constants/queryKey';
import { StatisticsItemSchema } from '../constants/schema';
import { STATISTICS_ENDPOINTS } from '../constants/url';

const ResponseSchema = z.object({
  categories: z.array(StatisticsItemSchema),
});

type ResponseType = z.infer<typeof ResponseSchema>;

const fetchAllStatistics = () =>
  get<ResponseType>(STATISTICS_ENDPOINTS['statistics'], {
    responseSchema: ResponseSchema,
  });

export const useAllStatisticsQuery = () =>
  useSuspenseQuery({
    queryKey: STATISTICS_QUERY_KEYS['statistics'],
    queryFn: fetchAllStatistics,
  });
