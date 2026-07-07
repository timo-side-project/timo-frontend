import { cn } from '@/src/lib/helpers/cn';

interface ThemeOption {
  id: string;
  name: string;
}

// TODO: 테마 API 연동 후 목업 데이터 제거
const THEME_OPTIONS: ThemeOption[] = [
  { id: 'theme-1', name: '테마 1 이름' },
  { id: 'theme-2', name: '테마 2 이름' },
  { id: 'theme-3', name: '테마 3 이름' },
  { id: 'theme-4', name: '테마 4 이름' },
];

export const DEFAULT_THEME_ID = THEME_OPTIONS[0]?.id ?? null;

interface ThemeSelectGridProps {
  selectedThemeId: string | null;
  onSelect: (id: string) => void;
}

const ThemeSelectGrid = ({
  selectedThemeId,
  onSelect,
}: ThemeSelectGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 pt-9">
      {THEME_OPTIONS.map((theme) => {
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
