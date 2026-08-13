import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

const deleteGroup = (groupId: number) =>
  del<never, void>(GROUP_ENDPOINT.group(groupId));

export const useDeleteGroupMutation = (groupId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: groupKeys.delete(groupId),
    mutationFn: () => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.list() });
    },
  });
};
