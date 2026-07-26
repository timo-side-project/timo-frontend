import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';
import { CATEGORY } from '@/src/lib/constants/character';

import { reflectionFeedbackKeys } from '../constants/queryKeys';
import { REFLECTION_FEEDBACK_ENDPOINTS } from '../constants/url';

const feedbackDetailSchema = z.object({
  id: z.number(),
  reflectionId: z.number(),
  category: z.enum(CATEGORY),
  score: z.number(),
  content: z.string().nullable(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  changedScore: z.number(),
  isIncreased: z.boolean(),
  beforeScore: z.number().nullish(),
  afterScore: z.number().nullish(),
  failureReason: z.string().nullish(),
  createdAt: z.string(),
});

export type ReflectionFeedbackDetailType = z.infer<typeof feedbackDetailSchema>;

const getReflectionFeedbackDetail = (reflectionId: number) =>
  get<ReflectionFeedbackDetailType>(
    REFLECTION_FEEDBACK_ENDPOINTS.feedbackDetail(reflectionId),
    {
      responseSchema: feedbackDetailSchema,
    },
  );

export const useReflectionFeedbackDetailQuery = (
  reflectionId: number | undefined,
  enabled: boolean,
) =>
  useQuery({
    queryKey: reflectionFeedbackKeys.detail(reflectionId ?? 0),
    queryFn: () => getReflectionFeedbackDetail(reflectionId as number),
    enabled: enabled && reflectionId !== undefined,
  });
