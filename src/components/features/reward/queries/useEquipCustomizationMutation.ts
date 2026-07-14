import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from '@/src/lib/api';

import { customizationKeys } from '../constants/queryKeys';
import { CUSTOMIZATION_ENDPOINTS } from '../constants/url';

const equipCustomization = async (customizationItemId: number): Promise<void> =>
  post<never, void>(CUSTOMIZATION_ENDPOINTS.equip(customizationItemId));

export const useEquipCustomizationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: customizationKeys.equip(),
    mutationFn: equipCustomization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customizationKeys.all });
    },
  });
};
