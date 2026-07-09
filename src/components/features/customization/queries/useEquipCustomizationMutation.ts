import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from '@/src/lib/api';

import { customizationKeys } from '../constants/queryKeys';
import { CUSTOMIZATION_ENDPOINTS } from '../constants/url';

interface EquipCustomizationParams {
  customizationItemId: number;
}

const equipCustomization = async ({
  customizationItemId,
}: EquipCustomizationParams) =>
  post<undefined, undefined>(
    CUSTOMIZATION_ENDPOINTS.equip(customizationItemId),
    undefined,
  );

export const useEquipCustomizationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: customizationKeys.equip(),
    mutationFn: equipCustomization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customizationKeys.list() });
    },
  });
};
