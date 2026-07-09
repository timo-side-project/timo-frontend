import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { get } from '@/src/lib/api';

import { customizationKeys } from '../constants/queryKeys';
import { CUSTOMIZATION_ENDPOINTS } from '../constants/url';

const customizationSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['THEME', 'DECORATION']),
  description: z.string(),
  isUnlocked: z.boolean(),
  isEquipped: z.boolean(),
});

export type CustomizationType = z.infer<typeof customizationSchema>['type'];

const customizationsSchema = z.array(customizationSchema);

export type CustomizationsResponse = z.infer<typeof customizationsSchema>;

const getCustomizations = async () =>
  get<CustomizationsResponse>(CUSTOMIZATION_ENDPOINTS.list, {
    responseSchema: customizationsSchema,
  });

export const useCustomizationsQuery = () =>
  useQuery({
    queryKey: customizationKeys.list(),
    queryFn: getCustomizations,
  });
