import ErrorState from '@/src/components/ui/ErrorState/ErrorState';
import Skeleton from '@/src/components/ui/Skeleton/Skeleton';
import { cn } from '@/src/lib/helpers/cn';

interface ThemeOption {
  id: number;
  name: string;
}

interface ThemeSelectGridProps {
  items: ThemeOption[];
  selectedThemeId: number | null;
  onSelect: (id: number) => void;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}

const ThemeSelectGrid = ({
  items,
  selectedThemeId,
  onSelect,
  isPending,
  isError,
  onRetry,
}: ThemeSelectGridProps) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 pt-9">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-37.5 w-full rounded-2xl"
            ariaLabel="테마 목록 로딩 중"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        className="mx-auto pt-16"
        title="테마 목록을 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요"
        onRetry={onRetry}
      />
    );
  }

  if (items.length === 0) {
    return (
      <ErrorState className="mx-auto pt-16" title="적용 가능한 테마가 없어요" />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 pt-9">
      {items.map((theme) => {
        const isSelected = theme.id === selectedThemeId;

        return (
          <button
            key={theme.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(theme.id)}
            className="flex flex-col items-center gap-3"
          >
            <div
              className={cn(
                'h-37.5 w-full rounded-2xl border-2 shadow-1',
                isSelected
                  ? 'border-g-0 bg-g-100'
                  : 'border-transparent bg-g-400',
              )}
            />
            <p className="font-body-s text-g-100">{theme.name}</p>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSelectGrid;
