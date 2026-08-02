'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCustomizationsQuery } from '@/src/components/features/customization/queries/useCustomizationsQuery';
import { useEquipCustomizationMutation } from '@/src/components/features/customization/queries/useEquipCustomizationMutation';
import { useUserDetailQuery } from '@/src/components/features/users/queries/useUserDetailQuery';
import { useToast } from '@/src/hooks/useToast';
import { getCharacterAsset } from '@/src/lib/helpers/getCharacterAsset';

export const useThemeSelect = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: customizations, isPending, isError } = useCustomizationsQuery();
  const { data: userDetail, isPending: isUserDetailPending } =
    useUserDetailQuery();
  const { mutateAsync } = useEquipCustomizationMutation();

  const themeItems = (customizations ?? []).filter(
    (item) => item.type === 'THEME',
  );
  const decorationItems = (customizations ?? []).filter(
    (item) => item.type === 'DECORATION',
  );

  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [selectedDecorationId, setSelectedDecorationId] = useState<
    number | null
  >(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const equippedTheme = themeItems.find((item) => item.isEquipped);
  const equippedDecoration = decorationItems.find((item) => item.isEquipped);

  const selectedTheme =
    selectedThemeId !== null
      ? themeItems.find((item) => item.id === selectedThemeId)
      : undefined;
  const selectedDecoration =
    selectedDecorationId !== null
      ? decorationItems.find((item) => item.id === selectedDecorationId)
      : undefined;

  const previewTheme = selectedTheme ?? equippedTheme;
  const previewDecoration = selectedDecoration ?? equippedDecoration;
  const isPreviewPending = selectedTheme
    ? false
    : isUserDetailPending || isPending;
  const defaultCharacter = getCharacterAsset(userDetail?.category);

  const handleSave = async () => {
    const idsToEquip = [selectedThemeId, selectedDecorationId].filter(
      (id): id is number => id !== null,
    );
    if (idsToEquip.length === 0) return;

    const results = await Promise.allSettled(
      idsToEquip.map((id) => mutateAsync({ customizationItemId: id })),
    );

    if (results.some((result) => result.status === 'rejected')) {
      showToast({
        message: '일부 적용에 실패했어요. 다시 시도해 주세요.',
        variant: 'alert',
      });
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleCloseModal = () => setIsApplyModalOpen(false);

  const handleConfirm = () => {
    setIsApplyModalOpen(false);
    router.push('/');
  };

  const previewImageUrl =
    previewTheme?.imageWithoutBackground ??
    previewTheme?.image ??
    defaultCharacter.src;
  const previewName = previewTheme?.name ?? defaultCharacter.alt;

  const previewDecorationImageUrl =
    previewDecoration?.imageWithoutBackground ??
    previewDecoration?.image ??
    null;
  const previewDecorationName = previewDecoration?.name ?? '';

  return {
    preview: {
      imageUrl: previewImageUrl,
      name: previewName,
      isPending: isPreviewPending,
      decorationImageUrl: previewDecorationImageUrl,
      decorationName: previewDecorationName,
    },
    themeGrid: {
      items: themeItems,
      selectedId: selectedThemeId ?? equippedTheme?.id ?? null,
      onSelect: setSelectedThemeId,
      isPending,
      isError,
    },
    decorationGrid: {
      items: decorationItems,
      selectedId: selectedDecorationId ?? equippedDecoration?.id ?? null,
      onSelect: setSelectedDecorationId,
      isPending,
      isError,
    },
    modal: {
      isOpen: isApplyModalOpen,
      onClose: handleCloseModal,
      onConfirm: handleConfirm,
      imageUrl: previewImageUrl,
      name: previewName,
      decorationImageUrl: previewDecorationImageUrl,
    },
    handleSave,
  };
};
