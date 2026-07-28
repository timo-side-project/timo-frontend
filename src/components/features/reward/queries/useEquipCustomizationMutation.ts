import { useMutation } from '@tanstack/react-query';

import { post } from '@/src/lib/api';

import { customizationKeys } from '../constants/queryKeys';
import { CUSTOMIZATION_ENDPOINTS } from '../constants/url';

const equipCustomization = async (customizationItemId: number): Promise<void> =>
  post<never, void>(CUSTOMIZATION_ENDPOINTS.equip(customizationItemId));

export const useEquipCustomizationMutation = () =>
  useMutation({
    mutationKey: customizationKeys.equip(),
    mutationFn: equipCustomization,
  });
