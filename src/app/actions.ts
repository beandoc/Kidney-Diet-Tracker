'use server';

import { searchFoodDatabase } from '@/ai/flows/search-food-database';
import type { Nutrient } from '@/lib/types';

function parseNutrient(text: string, nutrient: string): number {
  // This regex looks for the nutrient name, followed by any characters until it finds a number.
  // It captures the number (including decimals).
  // The 'i' flag makes it case-insensitive.
  // It handles formats like "Protein: 1.1g", "protein 25 g", "Sodium-1,200mg"
  const regex = new RegExp(`(?:${nutrient})[^\\d]*([\\d,]+\\.?\\d*|\\.\\d+)`, 'i');
  const match = text.match(regex);
  
  if (match && match[1]) {
    // Remove commas from numbers like "1,200" before parsing
    const numericValue = parseFloat(match[1].replace(/,/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  }
  
  return 0;
}

export async function getFoodNutrients(
  foodName: string,
  quantity: string
): Promise<Record<Nutrient, number>> {
  try {
    const result = await searchFoodDatabase({
      foodQuestion: `Nutritional information for ${quantity} of ${foodName}, including calories, protein, sodium, potassium, and phosphorus.`,
    });
    
    const answer = result.answer;

    const nutrients = {
      calories: parseNutrient(answer, 'calories'),
      protein: parseNutrient(answer, 'protein'),
      sodium: parseNutrient(answer, 'sodium'),
      potassium: parseNutrient(answer, 'potassium'),
      phosphorus: parseNutrient(answer, 'phosphorus'),
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
