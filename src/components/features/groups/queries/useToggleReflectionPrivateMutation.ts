import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del, post } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

interface TogglePrivateParams {
  groupId: number;
  reflectionId: number;
  isPrivate: boolean;
}

const toggleReflectionPrivate = ({
  groupId,
  reflectionId,
  isPrivate,
}: TogglePrivateParams) =>
  isPrivate
    ? del<never, void>(GROUP_ENDPOINT.reflectionPrivate(groupId, reflectionId))
    : post<never, void>(
        GROUP_ENDPOINT.reflectionPrivate(groupId, reflectionId),
      );

export const useToggleReflectionPrivateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: groupKeys.togglePrivate(),
    mutationFn: toggleReflectionPrivate,
    onSuccess: (_data, { groupId, reflectionId }) => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.friendListByGroup(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: groupKeys.reflectionDetail(groupId, reflectionId),
      });
    },
  });
};
