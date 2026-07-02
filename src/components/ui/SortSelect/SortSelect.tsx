'use client';

import Image from 'next/image';

import { useSortSelect } from '@/src/hooks/useSortSelect';
import { cn } from '@/src/lib/helpers/cn';

interface SortSelectOption<T extends string> {
  label: string;
  value: T;
}

interface SortSelectProps<T extends string> {
  options: readonly SortSelectOption<T>[];
  value: T;
  onChange?: (value: T) => void;
}

const SortSelect = <T extends string>({
  options,
  value,
  onChange,
}: SortSelectProps<T>) => {
  const { ref, selected, selectedLabel, isOpen, toggleOpen, handleSelect } =
    useSortSelect({ options, value, onChange });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center gap-1 rounded-full bg-g-400 px-3 py-1 font-caption-n text-g-20"
      >
        {selectedLabel}
        <Image
          src="/icons/chevron-left.svg"
          width={12}
          height={12}
          alt=""
          className={cn(
            'transition-transform',
            isOpen ? 'rotate-90' : '-rotate-90',
          )}
        />
      </button>

      {isOpen && (
        <ul className="absolute right-0 z-10 mt-1 min-w-full overflow-hidden rounded-2xl bg-g-400 py-1">
          {options.map(({ label, value }) => (
            <li key={value}>
              <button
                type="button"
                onClick={() => handleSelect(value)}
                className={cn(
                  'w-full px-4 py-2 text-left font-caption-n transition-colors',
                  selected === value ? 'text-primary' : 'text-g-20',
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortSelect;
