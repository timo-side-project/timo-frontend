import { z } from 'zod';

import { CATEGORY, CHARACTER_NAMES } from '@/src/lib/constants/character';

export const BaseDataPointSchema = z.object({
  score: z.number(),
  createdAt: z.coerce.date(),
  type: z.enum(['TEST', 'REFLECTION']),
});

export const StatisticsItemSchema = z.object({
  category: z.enum(CATEGORY),
  character: z.enum(CHARACTER_NAMES),
  personality: z.string(),
  idealScore: z.number(),
  dataPoints: z.array(BaseDataPointSchema),
});
