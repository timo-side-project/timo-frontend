import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del, post } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

interface ToggleLikeParams {
  groupId: number;
  reflectionId: number;
  isLiked: boolean;
}

const toggleReflectionLike = ({
  groupId,
  reflectionId,
  isLiked,
}: ToggleLikeParams) =>
  isLiked
    ? del<never, void>(GROUP_ENDPOINT.reflectionLike(groupId, reflectionId))
    : post<never, void>(GROUP_ENDPOINT.reflectionLike(groupId, reflectionId));

export const useToggleReflectionLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: groupKeys.toggleLike(),
    mutationFn: toggleReflectionLike,
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.friendListByGroup(groupId),
      });
    },
  });
};
