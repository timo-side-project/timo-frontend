'use client';

import { type ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

import { useBodyScrollLock } from '@/src/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/src/hooks/useEscapeKey';
import { cn } from '@/src/lib/helpers/cn';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel: string;
  contentClassName?: string;
  overlayClassName?: string;
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  ariaLabel,
  contentClassName,
  overlayClassName,
}: BottomSheetProps) => {
  // 내려가는 애니메이션이 끝날 때까지 DOM에 남겨둔다
  const [isRendered, setIsRendered] = useState(isOpen);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setIsRendered(true);
  }

  useEscapeKey(isOpen, onClose);
  useBodyScrollLock(isOpen);

  if (!isRendered || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-g-900/80',
          isOpen ? 'animate-fade-in' : 'animate-fade-out',
          overlayClassName,
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onAnimationEnd={() => {
          if (!isOpen) setIsRendered(false);
        }}
        className={cn(
          'relative z-10 w-full max-w-110 rounded-t-3xl bg-g-600 px-7.5 pb-10 pt-10',
          isOpen ? 'animate-slide-up-in' : 'animate-slide-down-out',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default BottomSheet;
