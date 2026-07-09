'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCustomizationsQuery } from '@/src/components/features/customization/queries/useCustomizationsQuery';
import { useEquipCustomizationMutation } from '@/src/components/features/customization/queries/useEquipCustomizationMutation';

export const useThemeSelect = () => {
  const router = useRouter();
  const {
    data: customizations,
    isPending,
    isError,
    refetch,
  } = useCustomizationsQuery();
  const { mutate } = useEquipCustomizationMutation();

  const themeItems = customizations ?? [];
  const defaultThemeId =
    (themeItems.find((item) => item.isEquipped) ?? themeItems[0])?.id ?? null;

  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const activeThemeId = selectedThemeId ?? defaultThemeId;

  const handleSave = () => {
    if (activeThemeId === null) return;

    mutate(
      { customizationItemId: activeThemeId },
      { onSuccess: () => setIsApplyModalOpen(true) },
    );
  };

  const handleCloseModal = () => setIsApplyModalOpen(false);

  const handleConfirm = () => {
    setIsApplyModalOpen(false);
    router.push('/');
  };

  const handleRetry = () => refetch();

  return {
    grid: {
      items: themeItems,
      selectedThemeId: activeThemeId,
      onSelect: setSelectedThemeId,
      isPending,
      isError,
      onRetry: handleRetry,
    },
    modal: {
      isOpen: isApplyModalOpen,
      onClose: handleCloseModal,
      onConfirm: handleConfirm,
    },
    handleSave,
  };
};
