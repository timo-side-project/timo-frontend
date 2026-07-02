import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';
import { CATEGORY, CHARACTER_NAMES } from '@/src/lib/constants/character';

import { TEST_RESULT_QUERY_KEYS } from '../constants/queryKeys';
import { TEST_RESULT_ENDPOINTS } from '../constants/url';

const ClosestCategorySchema = z.object({
  name: z.enum(CATEGORY),
  character: z.enum(CHARACTER_NAMES),
  personality: z.string(),
  description: z.string(),
});

const ScoreSchema = z.object({
  category: z.enum(CATEGORY),
  score: z.number(),
  idealScore: z.number(),
});

const ResponseSchema = z.object({
  id: z.number(),
  testId: z.number(),
  status: z.string(),
  progress: z.number().nullable(),
  createdAt: z.coerce.date(),
  result: z.object({
    closestCategory: ClosestCategorySchema,
    scores: z.array(ScoreSchema),
  }),
});

export type ResponseType = z.infer<typeof ResponseSchema>;

interface PathType {
  testRecordId: number;
}

const testRecord = ({ testRecordId }: PathType) =>
  get<ResponseType>(TEST_RESULT_ENDPOINTS['record'](testRecordId), {
    responseSchema: ResponseSchema,
  });

export const useTestRecordQuery = ({ testRecordId }: PathType) => {
  return useQuery({
    queryKey: TEST_RESULT_QUERY_KEYS['record'](testRecordId),
    queryFn: () => testRecord({ testRecordId }),
    staleTime: 60 * 1000 * 5,
  });
};
