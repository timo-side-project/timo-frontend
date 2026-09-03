'use client';

import { format } from 'date-fns';
import type { ComponentProps } from 'react';

import Icon from '@/src/components/ui/Icon/Icon';
import { CALENDAR_DATE_FORMAT } from '@/src/lib/constants/calendar';
import { cn } from '@/src/lib/helpers/cn';

interface FriendReflectionDateNavProps extends ComponentProps<'div'> {
  selectedDate: Date;
  isNextDisabled: boolean;
  onPrevDate: () => void;
  onNextDate: () => void;
  onOpenCalendar: () => void;
}

const FriendReflectionDateNav = ({
  selectedDate,
  isNextDisabled,
  onPrevDate,
  onNextDate,
  onOpenCalendar,
  className,
  ...props
}: FriendReflectionDateNavProps) => {
  return (
    <div
      className={cn('flex items-center justify-center gap-4', className)}
      {...props}
    >
      <button
        type="button"
        onClick={onPrevDate}
        aria-label="이전 날짜"
        className="flex h-8 w-8 items-center justify-center rounded-full text-g-80"
      >
        <Icon name="chevronLeft" decorative size={20} />
      </button>

      <button
        type="button"
        onClick={onOpenCalendar}
        className="font-label-n text-g-0 underline underline-offset-4"
      >
        {format(selectedDate, CALENDAR_DATE_FORMAT.dayLabel)}
      </button>

      <button
        type="button"
        onClick={onNextDate}
        disabled={isNextDisabled}
        aria-label="다음 날짜"
        className="flex h-8 w-8 items-center justify-center rounded-full text-g-80 disabled:opacity-30"
      >
        <Icon name="chevronLeft" decorative className="rotate-180" size={20} />
      </button>
    </div>
  );
};

export default FriendReflectionDateNav;
