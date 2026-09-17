import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { del, post } from '@/src/lib/api';

import { groupKeys } from '../constants/queryKey';
import { GROUP_ENDPOINT } from '../constants/url';

const togglePrivateResponseSchema = z.undefined();
type TogglePrivateResponse = z.infer<typeof togglePrivateResponseSchema>;

interface TogglePrivateParams {
  groupId: number;
  reflectionId: number;
  isPublic: boolean;
}

const toggleReflectionPrivate = ({
  groupId,
  reflectionId,
  isPublic,
}: TogglePrivateParams) => {
  const url = GROUP_ENDPOINT.reflectionPrivate(groupId, reflectionId);
  const config = { responseSchema: togglePrivateResponseSchema };

  return isPublic
    ? post<never, TogglePrivateResponse>(url, undefined, config)
    : del<never, TogglePrivateResponse>(url, undefined, config);
};

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
