import { useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';
import type { Category } from '@/src/lib/constants/character';

import { STATISTICS_QUERY_KEYS } from '../constants/queryKey';
import { BaseDataPointSchema, StatisticsItemSchema } from '../constants/schema';
import { STATISTICS_ENDPOINTS } from '../constants/url';

const DetailDataPointSchema = BaseDataPointSchema.extend({
  changedScore: z.number().nullable(),
  isIncreased: z.boolean().nullable(),
});

const ResponseSchema = StatisticsItemSchema.extend({
  changedScore: z.number().nullable(),
  proximityRate: z.number().nullable(),
  isCloserToIdeal: z.boolean().nullable(),
  dataPoints: z.array(DetailDataPointSchema),
});

type ResponseType = z.infer<typeof ResponseSchema>;

const fetchStatisticsDetail = (category: Category) =>
  get<ResponseType>(STATISTICS_ENDPOINTS.detail(category), {
    responseSchema: ResponseSchema,
  });

export const useStatisticsDetailQuery = (category: Category) =>
  useSuspenseQuery({
    queryKey: STATISTICS_QUERY_KEYS.detail(category),
    queryFn: () => fetchStatisticsDetail(category),
  });
