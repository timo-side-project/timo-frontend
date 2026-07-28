export const customizationKeys = {
  all: ['customizations'] as const,
  list: () => [...customizationKeys.all, 'list'] as const,
  equip: () => [...customizationKeys.all, 'equip'] as const,
};
