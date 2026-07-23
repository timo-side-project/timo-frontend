'use client';

import { useThemeSelect } from '@/src/components/features/profile/hooks/useThemeSelect';
import ThemeApplyModal from '@/src/components/features/profile/ThemeApplyModal/ThemeApplyModal';
import ThemeHeader from '@/src/components/features/profile/ThemeHeader/ThemeHeader';
import ThemePreview from '@/src/components/features/profile/ThemePreview/ThemePreview';
import ThemeSelectGrid from '@/src/components/features/profile/ThemeSelectGrid/ThemeSelectGrid';

const ThemeSelectSection = () => {
  const { preview, themeGrid, decorationGrid, modal, handleSave } =
    useThemeSelect();

  return (
    <>
      <div className="-mx-7.5 bg-g-600 px-7.5">
        <ThemeHeader onSave={handleSave} />
        <ThemePreview
          imageUrl={preview.imageUrl}
          name={preview.name}
          isPending={preview.isPending}
          decorationImageUrl={preview.decorationImageUrl}
          decorationName={preview.decorationName}
        />
      </div>
      <div className="pb-32">
        <ThemeSelectGrid
          title="테마"
          items={themeGrid.items}
          selectedId={themeGrid.selectedId}
          onSelect={themeGrid.onSelect}
          isPending={themeGrid.isPending}
          isError={themeGrid.isError}
        />
        <ThemeSelectGrid
          title="펫"
          items={decorationGrid.items}
          selectedId={decorationGrid.selectedId}
          onSelect={decorationGrid.onSelect}
          isPending={decorationGrid.isPending}
          isError={decorationGrid.isError}
        />
      </div>
      <ThemeApplyModal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        onConfirm={modal.onConfirm}
        imageUrl={modal.imageUrl}
        name={modal.name}
        decorationImageUrl={modal.decorationImageUrl}
      />
    </>
  );
};

export default ThemeSelectSection;
