import { useState } from 'react';

import { useToggleReflectionLikeMutation } from '../queries/useToggleReflectionLikeMutation';

interface UseReflectionLikeStateParams {
  groupId: number;
  reflectionId: number;
  initialIsLiked?: boolean;
  initialLikeCount?: number;
}

export const useReflectionLikeState = ({
  groupId,
  reflectionId,
  initialIsLiked,
  initialLikeCount,
}: UseReflectionLikeStateParams) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked ?? false);
  const [likeCount, setLikeCount] = useState(initialLikeCount ?? 0);

  const { mutate, isPending } = useToggleReflectionLikeMutation();

  const toggle = () => {
    const previous = { isLiked, likeCount };
    const nextIsLiked = !isLiked;

    setIsLiked(nextIsLiked);
    setLikeCount((count) => Math.max(0, count + (nextIsLiked ? 1 : -1)));

    mutate(
      { groupId, reflectionId, isLiked },
      {
        onError: () => {
          setIsLiked(previous.isLiked);
          setLikeCount(previous.likeCount);
        },
      },
    );
  };

  return { isLiked, likeCount, toggle, isToggling: isPending };
};
