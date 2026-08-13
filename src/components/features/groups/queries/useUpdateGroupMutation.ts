import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { patch } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

const updateGroupRequestSchema = z.object({
  name: z.string().trim().min(1).optional(),
  image: z.string().nullable().optional(),
});

type UpdateGroupRequest = z.infer<typeof updateGroupRequestSchema>;

const updateGroup = (groupId: number, request: UpdateGroupRequest) =>
  patch<UpdateGroupRequest, void>(GROUP_ENDPOINT.group(groupId), request, {
    dataSchema: updateGroupRequestSchema,
  });

export const useUpdateGroupMutation = (groupId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: groupKeys.update(groupId),
    mutationFn: (request: UpdateGroupRequest) => updateGroup(groupId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.list() });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
    },
  });
};
