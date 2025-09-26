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
    
    if (NUTRITIONIX_APP_ID === "YOUR_NUTRITIONIX_APP_ID" || NUTRITIONIX_APP_KEY === "YOUR_NUTRITIONIX_APP_KEY") {
      console.warn("Using placeholder Nutritionix API credentials. Please update .env.local with your actual keys.");
      // Return empty/zeroed data if using placeholder keys to avoid API errors
      return {
        calories: 0,
        protein: 0,
        sodium: 0,
        potassium: 0,
        phosphorus: 0,
      };
    }

    try {
        const response = await fetch(NUTRITIONIX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-app-id': NUTRITIONIX_APP_ID,
                'x-app-key': NUTRITIONIX_APP_KEY,
            },
            body: JSON.stringify({
                query: foodQuery,
                timezone: 'US/Eastern',
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Nutritionix API error: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Nutritionix API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.foods || data.foods.length === 0) {
            return {
                calories: 0,
                protein: 0,
                sodium: 0,
                potassium: 0,
                phosphorus: 0,
            };
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
        throw new Error('Failed to fetch nutrient data.');
    }
  }
);
