'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ThemeApplyModal from '@/src/components/features/profile/ThemeApplyModal/ThemeApplyModal';
import ThemeHeader from '@/src/components/features/profile/ThemeHeader/ThemeHeader';
import ThemePreview from '@/src/components/features/profile/ThemePreview/ThemePreview';
import ThemeSelectGrid, {
  DEFAULT_THEME_ID,
} from '@/src/components/features/profile/ThemeSelectGrid/ThemeSelectGrid';

const ThemeSelectSection = () => {
  const router = useRouter();
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(
    DEFAULT_THEME_ID,
  );
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleSave = () => {
    // TODO: 테마 API 명세 확정되면 mutate 연결
    setIsApplyModalOpen(true);
  };

  const handleConfirm = () => {
    setIsApplyModalOpen(false);
    router.push('/profile');
  };

  return (
    <>
      <div className="-mx-7.5 bg-g-600 px-7.5">
        <ThemeHeader onSave={handleSave} />
        <ThemePreview />
      </div>
      <div className="pb-32">
        <ThemeSelectGrid
          selectedThemeId={selectedThemeId}
          onSelect={setSelectedThemeId}
        />
      </div>
      <ThemeApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default ThemeSelectSection;
