import Image from 'next/image';

import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import { cn } from '@/src/lib/helpers/cn';

interface ThemeOption {
  id: number;
  name: string;
  image: string;
}

type ThemeSelectGridVariant = 'THEME' | 'DECORATION';

interface ThemeSelectGridProps {
  title: string;
  items: ThemeOption[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  isPending: boolean;
  isError: boolean;
  variant: ThemeSelectGridVariant;
}

const IMAGE_SIZE_CLASS: Record<ThemeSelectGridVariant, string> = {
  THEME: 'h-40 w-40',
  DECORATION: 'h-18 w-18',
};

const ThemeSelectGrid = ({
  title,
  items,
  selectedId,
  onSelect,
  isPending,
  isError,
  variant,
}: ThemeSelectGridProps) => {
  if (isPending) {
    return (
      <div className="pt-9">
        <p className="font-body-s-bold text-g-0">{title}</p>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 pt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-37.5 w-full rounded-2xl"
              ariaLabel={`${title} 목록 로딩 중`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        className="mx-auto pt-16"
        title={`${title} 목록을 불러오지 못했어요`}
        description="잠시 후 다시 시도해 주세요"
      />
    );
  }

  if (items.length === 0) {
    return (
      <ErrorState
        className="mx-auto pt-16"
        title={`적용 가능한 ${title}이 없어요`}
      />
    );
  }

  return (
    <div className="pt-9">
      <p className="font-body-s-bold text-g-0">{title}</p>
      <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 pt-4">
        {items.map((theme) => {
          const isSelected = theme.id === selectedId;

          return (
            <button
              key={theme.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(isSelected ? null : theme.id)}
              className="flex flex-col items-center gap-3"
            >
              <div
                className={cn(
                  'relative flex h-37.5 w-full items-center justify-center overflow-hidden rounded-2xl border-2 shadow-1',
                  isSelected
                    ? 'border-g-0 bg-g-100'
                    : 'border-transparent bg-g-400',
                )}
              >
                <div className={cn('relative', IMAGE_SIZE_CLASS[variant])}>
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    fill
                    sizes="159px"
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="font-body-s text-g-100">{theme.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelectGrid;
