export const REWARD_ROUTE = '/reward';

export const CUSTOMIZATION_ENDPOINTS = {
  recentlyUnlocked: '/customizations/recently-unlocked',
  equip: (customizationItemId: number) =>
    `/customizations/${customizationItemId}/equip`,
} as const;
