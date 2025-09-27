
'use server';

import {
  identifyFoodFromPhoto,
  type IdentifyFoodFromPhotoInput,
  type IdentifyFoodFromPhotoOutput,
} from '@/ai/flows/identify-food-from-photo';

export async function analyzeFoodPhoto(
  input: IdentifyFoodFromPhotoInput
): Promise<IdentifyFoodFromPhotoOutput> {
  return await identifyFoodFromPhoto(input);
}

    