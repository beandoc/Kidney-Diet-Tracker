
'use server';

/**
 * @fileOverview Implements a Genkit flow to search a food database and provide nutrient information.
 *
 * - searchFoodDatabase - A function that searches the food database and returns nutrient information.
 * - SearchFoodDatabaseInput - The input type for the searchFoodDatabase function.
 * - SearchFoodDatabaseOutput - The return type for the searchFoodDatabase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { resolveFoodName } from './resolve-food-name';

const SearchFoodDatabaseInputSchema = z.object({
  foodQuery: z
    .string()
    .describe('A query for a food item, e.g., "1 large apple and 2 slices of bread"'),
});
export type SearchFoodDatabaseInput = z.infer<typeof SearchFoodDatabaseInputSchema>;

const SearchFoodDatabaseOutputSchema = z.object({
  calories: z.number().optional(),
  protein: z.number().optional(),
  sodium: z.number().optional(),
  potassium: z.number().optional(),
  phosphorus: z.number().optional(),
});
export type SearchFoodDatabaseOutput = z.infer<typeof SearchFoodDatabaseOutputSchema>;

export async function searchFoodDatabase(input: SearchFoodDatabaseInput): Promise<SearchFoodDatabaseOutput> {
  return searchFoodDatabaseFlow(input);
}

const searchFoodDatabaseFlow = ai.defineFlow(
  {
    name: 'searchFoodDatabaseFlow',
    inputSchema: SearchFoodDatabaseInputSchema,
    outputSchema: SearchFoodDatabaseOutputSchema,
  },
  async ({ foodQuery }) => {
    const NUTRITIONIX_API_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
    const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY;

    if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_APP_KEY) {
        throw new Error("Nutritionix API credentials are not configured in environment variables.");
    }

    const searchNutritionix = async (query: string): Promise<SearchFoodDatabaseOutput | null> => {
        try {
            const response = await fetch(NUTRITIONIX_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': NUTRITIONIX_APP_ID,
                    'x-app-key': NUTRITIONIX_APP_KEY,
                },
                body: JSON.stringify({
                    query: query,
                    timezone: 'US/Eastern',
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`Nutritionix API error: ${response.status} ${response.statusText}`, errorBody);
                return null;
            }

            const data = await response.json();
            
            if (!data.foods || data.foods.length === 0) {
                console.log(`No food found for query: "${query}"`);
                return null;
            }

            // Sum up nutrients from all food items found
            const totals = data.foods.reduce((acc: any, food: any) => {
                acc.calories += food.nf_calories || 0;
                acc.protein += food.nf_protein || 0;
                acc.sodium += food.nf_sodium || 0;
                acc.potassium += food.nf_potassium || 0;
                acc.phosphorus += food.nf_phosphorus || 0;
                return acc;
            }, {
                calories: 0,
                protein: 0,
                sodium: 0,
                potassium: 0,
                phosphorus: 0,
            });

            return totals;

        } catch (error) {
            console.error('Error fetching data from Nutritionix API:', error);
            // We throw here because it's a network/unexpected error, not a "not found" case.
            throw new Error('Failed to fetch nutrient data from Nutritionix.');
        }
    }
    
    // Step 1: Try the original query
    let result = await searchNutritionix(foodQuery);

    // Step 2: If it fails, try to resolve the name with AI and retry
    if (!result) {
        console.log(`Initial search for "${foodQuery}" failed. Trying to resolve food name.`);
        try {
            // Regex to separate quantity/measure from the food name.
            // Handles cases like "1 cup", "1.5", "large", "100g", etc.
            const regex = /^\s*(\d*\.?\d*\s*)?([\w\s/-]+)?\s*([\w\s]+)\s*$/;
            const match = foodQuery.trim().match(regex);
            
            let quantityAndMeasure = '';
            let foodName = '';

            if (match) {
                 // Reconstruct quantity and measure from capturing groups. This logic is much more robust.
                const quantity = match[1] ? match[1].trim() : '';
                const measure = match[2] ? match[2].trim() : '';
                foodName = match[3] ? match[3].trim() : '';
                
                // If regex fails to parse, fall back to using the whole query.
                if (!foodName) foodName = foodQuery;
                
                quantityAndMeasure = `${quantity} ${measure}`.trim();
            } else {
                foodName = foodQuery;
            }
            
            if (foodName) {
                console.log(`Extracted food name "${foodName}" for resolution.`);
                const resolved = await resolveFoodName({ foodName: foodName });

                // Only retry if the name was actually changed by the resolver
                if (resolved.standardName && resolved.standardName.toLowerCase() !== foodName.toLowerCase()) {
                    const newQuery = `${quantityAndMeasure} ${resolved.standardName}`.trim();
                    console.log(`Retrying search with resolved name: "${newQuery}"`);
                    result = await searchNutritionix(newQuery);
                }
            }
        } catch (resolveError) {
            console.error("Failed to resolve food name with AI", resolveError);
            // Don't throw, just proceed to the final check
        }
    }
    
    // If still no result after all attempts, return zeroed-out nutrients
    if (!result) {
        return {
            calories: 0,
            protein: 0,
            sodium: 0,
            potassium: 0,
            phosphorus: 0,
        };
    }
    
    return result;
  }
);
