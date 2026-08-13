import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

const leaveGroup = (groupId: number) =>
  del<never, void>(GROUP_ENDPOINT.leaveGroup(groupId));

export const useLeaveGroupMutation = (groupId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: groupKeys.leave(groupId),
    mutationFn: () => leaveGroup(groupId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: groupKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.list() });
    },
  });
};
