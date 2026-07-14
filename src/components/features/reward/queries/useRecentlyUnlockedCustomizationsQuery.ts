import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';

import { customizationKeys } from '../constants/queryKeys';
import { CUSTOMIZATION_ENDPOINTS } from '../constants/url';

const customizationTypeSchema = z.enum(['THEME', 'DECORATION']);
const unlockConditionTypeSchema = z.enum(['TOTAL_COUNT', 'STREAK_COUNT']);

const unlockedCustomizationItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: customizationTypeSchema,
  description: z.string(),
  unlockConditionType: unlockConditionTypeSchema,
  unlockConditionCount: z.number(),
  image: z.string(),
});

const recentlyUnlockedCustomizationsSchema = z.array(
  unlockedCustomizationItemSchema,
);

export type CustomizationType = z.infer<typeof customizationTypeSchema>;
export type UnlockConditionType = z.infer<typeof unlockConditionTypeSchema>;
export type UnlockedCustomizationItem = z.infer<
  typeof unlockedCustomizationItemSchema
>;

export const getRecentlyUnlockedCustomizations = async () =>
  get<UnlockedCustomizationItem[]>(CUSTOMIZATION_ENDPOINTS.recentlyUnlocked, {
    responseSchema: recentlyUnlockedCustomizationsSchema,
  });

export const useRecentlyUnlockedCustomizationsQuery = () =>
  useQuery({
    queryKey: customizationKeys.recentlyUnlocked(),
    queryFn: getRecentlyUnlockedCustomizations,
  });
