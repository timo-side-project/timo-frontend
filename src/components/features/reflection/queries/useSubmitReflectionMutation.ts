import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { groupKeys } from '@/src/components/features/groups/constants/queryKey';
import { post } from '@/src/lib/api';

import { reflectionKeys } from '../constants/queryKeys';
import { REFLECTION_ENDPOINTS } from '../constants/url';

const submitReflectionRequestSchema = z.object({
  content: z.string(),
});

const submitReflectionResponseSchema = z.object({
  id: z.number(),
});

type SubmitReflectionRequestType = z.infer<
  typeof submitReflectionRequestSchema
>;
export type SubmitReflectionResponseType = z.infer<
  typeof submitReflectionResponseSchema
>;

const submitReflection = async ({ content }: SubmitReflectionRequestType) => {
  return post<SubmitReflectionRequestType, SubmitReflectionResponseType>(
    REFLECTION_ENDPOINTS.submitReflection,
    { content },
    {
      dataSchema: submitReflectionRequestSchema,
      responseSchema: submitReflectionResponseSchema,
    },
  );
};

export const useSubmitReflectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: reflectionKeys.submitReflection(),
    mutationFn: submitReflection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all() });
    },
  });
};
