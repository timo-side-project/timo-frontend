export const customizationKeys = {
  all: ['customizations'] as const,
  recentlyUnlocked: () =>
    [...customizationKeys.all, 'recentlyUnlocked'] as const,
  equip: () => [...customizationKeys.all, 'equip'] as const,
};
