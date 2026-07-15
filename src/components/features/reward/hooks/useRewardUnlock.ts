'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/src/hooks/useToast';

import { customizationKeys } from '../constants/queryKeys';
import { REWARD_ROUTE } from '../constants/url';
import { getRecentlyUnlockedCustomizations } from '../queries/useRecentlyUnlockedCustomizationsQuery';

export const useRewardUnlock = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
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

      router.push(items.length > 0 ? REWARD_ROUTE : '/');
    } catch {
      showToast({ message: '보상 정보를 불러오지 못했어요.' });
      router.push('/');
    } finally {
      setIsChecking(false);
    }
  };

  return { isChecking, start };
};
