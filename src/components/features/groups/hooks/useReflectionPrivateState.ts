import { useState } from 'react';

import { useToggleReflectionPrivateMutation } from '../queries/useToggleReflectionPrivateMutation';

interface UseReflectionPrivateStateParams {
  groupId: number;
  reflectionId: number;
  initialIsPublic: boolean;
}

export const useReflectionPrivateState = ({
  groupId,
  reflectionId,
  initialIsPublic,
}: UseReflectionPrivateStateParams) => {
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  const { mutate, isPending } = useToggleReflectionPrivateMutation();

  const toggle = () => {
    const previous = isPublic;
    const nextIsPublic = !isPublic;

    setIsPublic(nextIsPublic);

    mutate(
      { groupId, reflectionId, isPublic },
      {
        onError: () => {
          setIsPublic(previous);
        },
      },
    );
  };

  return { isPublic, toggle, isToggling: isPending };
};
