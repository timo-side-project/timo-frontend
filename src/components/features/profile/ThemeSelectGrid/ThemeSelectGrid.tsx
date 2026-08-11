import Image from 'next/image';

import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Icon from '@/src/components/ui/Icon/Icon';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import { cn } from '@/src/lib/helpers/cn';
import { getSubjectParticle } from '@/src/lib/helpers/getSubjectParticle';

interface ThemeOption {
  id: number;
  name: string;
  image: string;
  isUnlocked: boolean;
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

const LOCK_ICON_SIZE = 44;

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
        title={`적용 가능한 ${title}${getSubjectParticle(title)} 없어요`}
      />
    );
  }

  return (
    <div className="pt-9">
      <p className="font-body-s-bold text-g-0">{title}</p>
      <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 pt-4">
        {items.map((theme) => {
          const isSelected = theme.id === selectedId;
          const isLocked = !theme.isUnlocked;

          return (
            <button
              key={theme.id}
              type="button"
              disabled={isLocked}
              aria-pressed={isSelected}
              aria-disabled={isLocked}
              onClick={() => {
                if (isLocked) return;
                onSelect(isSelected ? null : theme.id);
              }}
              className={cn(
                'flex flex-col items-center gap-3',
                isLocked && 'cursor-not-allowed',
              )}
            >
              <div
                className={cn(
                  'relative flex h-37.5 w-full items-center justify-center overflow-hidden rounded-2xl border-2 shadow-1',
                  isSelected
                    ? 'border-g-0 bg-g-100'
                    : 'border-transparent bg-g-400',
                )}
              >
                <div
                  className={cn(
                    'relative',
                    IMAGE_SIZE_CLASS[variant],
                    isLocked && 'blur-sm',
                  )}
                >
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    fill
                    sizes="159px"
                    className="object-contain"
                  />
                </div>
                {isLocked && (
                  <Icon
                    name="lock"
                    size={LOCK_ICON_SIZE}
                    decorative
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                )}
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
