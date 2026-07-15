'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useToast } from '@/src/hooks/useToast';

import { customizationKeys } from '../constants/queryKeys';
import {
  getRecentlyUnlockedCustomizations,
  type UnlockedCustomizationItem,
} from '../queries/useRecentlyUnlockedCustomizationsQuery';

export const useRewardUnlock = (onFinish: () => void) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [unlockedItems, setUnlockedItems] = useState<
    UnlockedCustomizationItem[] | null
  >(null);
  const [isChecking, setIsChecking] = useState(false);

  const start = async () => {
    if (isChecking) {
      return;
    }

    setIsChecking(true);
    try {
      const items = await queryClient.fetchQuery({
        queryKey: customizationKeys.recentlyUnlocked(),
        queryFn: getRecentlyUnlockedCustomizations,
      });

      if (items.length > 0) {
        setUnlockedItems(items);
        return;
      }

      onFinish();
    } catch {
      showToast({ message: '보상 정보를 불러오지 못했어요.' });
      onFinish();
    } finally {
      setIsChecking(false);
    }
  };

  return { unlockedItems, isChecking, start };
};
