
'use server';

import { LOCAL_FOOD_DATABASE } from '@/lib/food-database';
import type { FoodItem, Nutrient } from '@/lib/types';
import { dairyAndEggs } from '@/lib/data/dairy-and-eggs';
import { fruitsAndVeggies } from '@/lib/data/fruits-and-veggies';
import { indianCuisine } from '@/lib/data/indian-cuisine';
import { nutsAndSeeds } from '@/lib/data/nuts-and-seeds';


const foodCategories: Record<string, Omit<FoodItem, 'id'>[]> = {
    'Dairy & Eggs': dairyAndEggs,
    'Fruits & Veggies': fruitsAndVeggies,
    'Indian Cuisine': indianCuisine,
    'Nuts & Seeds': nutsAndSeeds
};

function getFoodCategory(foodItem: FoodItem | Omit<FoodItem, 'id'>): string | null {
    for (const category in foodCategories) {
        if (foodCategories[category].some(item => item.name === foodItem.name)) {
            return category;
        }
    }
    return null;
}

export async function getMealAlternatives(
  currentItems: FoodItem[],
  dailyTotals: Record<Nutrient, number>,
  dailyGoals: Record<Nutrient, number>
): Promise<{ original: FoodItem; alternative: Omit<FoodItem, 'id'> }[]> {
  const alternatives: { original: FoodItem; alternative: Omit<FoodItem, 'id'> }[] = [];
  if (currentItems.length === 0) {
    return [];
  }
  
  const usedOriginalNames = new Set<string>();
  const usedAlternativeNames = new Set<string>();

  for (const item of currentItems) {
     if (usedOriginalNames.has(item.name)) continue;

    const originalCategory = getFoodCategory(item);
    
    // Find an alternative from a *different* category
    const potentialAlternatives = LOCAL_FOOD_DATABASE.filter(alt => {
      if (usedAlternativeNames.has(alt.name) || alt.name === item.name) return false;
      
      const altCategory = getFoodCategory(alt);
      if (!altCategory || altCategory === originalCategory) {
        return false;
      }
      
      const calorieDiff = Math.abs(alt.nutrients.calories - item.nutrients.calories);
      const proteinDiff = Math.abs(alt.nutrients.protein - item.nutrients.protein);
      
      // Looser criteria: within 50 calories and 5g of protein
      if (calorieDiff > 50 || proteinDiff > 5) {
          return false;
      }
      
      // Safety Check: Ensure the swap doesn't exceed micronutrient goals
      const criticalNutrients: Nutrient[] = ['sodium', 'potassium', 'phosphorus'];
      for (const nutrient of criticalNutrients) {
          const originalValue = item.nutrients[nutrient] || 0;
          const alternativeValue = alt.nutrients[nutrient] || 0;
          const currentTotal = dailyTotals[nutrient] || 0;
          const goal = dailyGoals[nutrient];
          
          // Calculate the hypothetical new total after the swap
          const newTotal = currentTotal - originalValue + alternativeValue;

          if (newTotal > goal) {
              // This alternative would push the user over their limit for this nutrient.
              return false;
          }
      }

      return true;
    });

    if (potentialAlternatives.length > 0) {
      // Simple logic: just pick the first one we find.
      const chosenAlternative = potentialAlternatives[0];
      alternatives.push({ original: item, alternative: chosenAlternative });
      usedOriginalNames.add(item.name);
      usedAlternativeNames.add(chosenAlternative.name);

      // Limit to 3 suggestions for a clean UI
      if (alternatives.length >= 3) break;
    }
  }

  return alternatives;
}
