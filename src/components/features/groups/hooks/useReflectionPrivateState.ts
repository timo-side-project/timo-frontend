import { useState } from 'react';

import { useToggleReflectionPrivateMutation } from '../queries/useToggleReflectionPrivateMutation';

interface UseReflectionPrivateStateParams {
  groupId: number;
  reflectionId: number;
  initialIsPrivate?: boolean;
}

export const useReflectionPrivateState = ({
  groupId,
  reflectionId,
  initialIsPrivate,
}: UseReflectionPrivateStateParams) => {
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate ?? false);

  const { mutate, isPending } = useToggleReflectionPrivateMutation();

  const toggle = () => {
    const previous = isPrivate;
    const nextIsPrivate = !isPrivate;

    setIsPrivate(nextIsPrivate);

    mutate(
      { groupId, reflectionId, isPrivate },
      {
        onError: () => {
          setIsPrivate(previous);
        },
      },
    );
  };

  return { isPrivate, toggle, isToggling: isPending };
};
