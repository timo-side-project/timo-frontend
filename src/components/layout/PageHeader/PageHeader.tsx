import type { ReactNode } from 'react';

import { cn } from '@/src/lib/helpers/cn';

interface PageHeaderProps {
  title: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  leftSlotVariant?: 'icon' | 'logo';
  rightSlotVariant?: 'icon' | 'logo';
  leftAriaLabel?: string;
  rightAriaLabel?: string;
  className?: string;
}

const PageHeader = ({
  title,
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
  leftSlotVariant = 'icon',
  rightSlotVariant = 'icon',
  leftAriaLabel = 'left action',
  rightAriaLabel = 'right action',
  className,
}: PageHeaderProps) => {
  const slotBaseClassName = 'h-10 flex items-center justify-center';
  const slotVariantClassName = {
    icon: 'w-10',
    logo: 'w-auto',
  } as const;

  return (
    <header className={cn('flex items-center gap-2 h-14', className)}>
      <button
        type="button"
        onClick={onLeftClick}
        className={cn(slotBaseClassName, slotVariantClassName[leftSlotVariant])}
        aria-label={leftAriaLabel}
      >
        {leftIcon ?? <div className="h-6 w-6 rounded-full" />}
      </button>

      <h1 className="flex-1 text-center font-heading-h3 text-g-0">{title}</h1>

      <button
        type="button"
        onClick={onRightClick}
        className={cn(
          slotBaseClassName,
          slotVariantClassName[rightSlotVariant],
        )}
        aria-label={rightAriaLabel}
      >
        {rightIcon ?? <div className="h-6 w-6 rounded-full" />}
      </button>
    </header>
  );
};

export default PageHeader;
