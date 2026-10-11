'use client';

import { useEffect } from 'react';

/**
 * 활성화된 동안 ESC 키를 누르면 onEscape를 호출한다.
 */
export const useEscapeKey = (isActive: boolean, onEscape: () => void) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isActive, onEscape]);
};
