'use client';

import { useEffect } from 'react';

/**
 * 활성화된 동안 body 스크롤을 잠근다. 해제 시 이전 값으로 되돌린다.
 */
export const useBodyScrollLock = (isActive: boolean) => {
  useEffect(() => {
    if (!isActive || typeof window === 'undefined') {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isActive]);
};
