'use server';

import { searchFoodDatabase } from '@/ai/flows/search-food-database';
import type { Nutrient } from '@/lib/types';


export async function getFoodNutrients(
  foodName: string,
  quantity: string
): Promise<Record<Nutrient, number>> {
  try {
    const result = await searchFoodDatabase({
      foodQuery: `${quantity} ${foodName}`,
    });
    
    const nutrients = {
      calories: result.calories || 0,
      protein: result.protein || 0,
      sodium: result.sodium || 0,
      potassium: result.potassium || 0,
      phosphorus: result.phosphorus || 0,
    };
    
    return nutrients;
  } catch (error) {
    console.error('Error fetching food nutrients:', error);
    // Return zeroed-out nutrients on error
    return {
      calories: 0,
      protein: 0,
      sodium: 0,
      potassium: 0,
      phosphorus: 0,
    };
  }
}
