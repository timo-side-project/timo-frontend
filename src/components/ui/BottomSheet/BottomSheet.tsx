'use client';

import { type ReactNode } from 'react';
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
  useEscapeKey(isOpen, onClose);
  useBodyScrollLock(isOpen);

  if (typeof window === 'undefined') {
    return null;
  }

  // 닫혀 있어도 DOM에 남겨 내려가는 전환을 보여주고, 상호작용은 inert로 막는다
  return createPortal(
    <div
      inert={!isOpen}
      aria-hidden={!isOpen}
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className={cn('absolute inset-0 bg-g-900/80', overlayClassName)}
      />

      <div
        role="dialog"
        aria-modal={isOpen}
        aria-label={ariaLabel}
        className={cn(
          'absolute inset-x-0 bottom-0 mx-auto w-full max-w-110 rounded-t-3xl bg-g-600 px-7.5 pb-10 pt-10 transition-transform duration-300',
          isOpen ? 'translate-y-0' : 'translate-y-full',
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
