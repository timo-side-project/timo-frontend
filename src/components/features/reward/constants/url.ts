export const REWARD_ROUTE = '/reward';

export const PROFILE_THEME_ROUTE = '/profile/theme';

export const CUSTOMIZATION_ENDPOINTS = {
  recentlyUnlocked: '/customizations/recently-unlocked',
  equip: (customizationItemId: number) =>
    `/customizations/${customizationItemId}/equip`,
} as const;
