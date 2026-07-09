export const CUSTOMIZATION_ENDPOINTS = {
  list: '/customizations',
  equip: (customizationItemId: number) =>
    `/customizations/${customizationItemId}/equip`,
} as const;
