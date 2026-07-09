'use client';

import { useThemeSelect } from '@/src/components/features/profile/hooks/useThemeSelect';
import ThemeApplyModal from '@/src/components/features/profile/ThemeApplyModal/ThemeApplyModal';
import ThemeHeader from '@/src/components/features/profile/ThemeHeader/ThemeHeader';
import ThemePreview from '@/src/components/features/profile/ThemePreview/ThemePreview';
import ThemeSelectGrid from '@/src/components/features/profile/ThemeSelectGrid/ThemeSelectGrid';

const ThemeSelectSection = () => {
  const { grid, modal, handleSave } = useThemeSelect();

  return (
    <>
      <div className="-mx-7.5 bg-g-600 px-7.5">
        <ThemeHeader onSave={handleSave} />
        <ThemePreview />
      </div>
      <div className="pb-32">
        <ThemeSelectGrid
          items={grid.items}
          selectedThemeId={grid.selectedThemeId}
          onSelect={grid.onSelect}
          isPending={grid.isPending}
          isError={grid.isError}
          onRetry={grid.onRetry}
        />
      </div>
      <ThemeApplyModal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        onConfirm={modal.onConfirm}
      />
    </>
  );
};

export default ThemeSelectSection;
