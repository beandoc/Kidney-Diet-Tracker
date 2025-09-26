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
  foodQuestion: z
    .string()
    .describe('A question about a food item, e.g., \"how much potassium is in a banana?\"'),
});
export type SearchFoodDatabaseInput = z.infer<typeof SearchFoodDatabaseInputSchema>;

const SearchFoodDatabaseOutputSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the food question, including relevant nutrient values.'),
});
export type SearchFoodDatabaseOutput = z.infer<typeof SearchFoodDatabaseOutputSchema>;

export async function searchFoodDatabase(input: SearchFoodDatabaseInput): Promise<SearchFoodDatabaseOutput> {
  return searchFoodDatabaseFlow(input);
}

const searchFoodDatabasePrompt = ai.definePrompt({
  name: 'searchFoodDatabasePrompt',
  input: {schema: SearchFoodDatabaseInputSchema},
  output: {schema: SearchFoodDatabaseOutputSchema},
  prompt: `You are a nutrition expert with access to a detailed food database.  A user will ask a question about a food item, and you should respond with the requested nutrient information from the database.

Question: {{{foodQuestion}}}
`,
});

const searchFoodDatabaseFlow = ai.defineFlow(
  {
    name: 'searchFoodDatabaseFlow',
    inputSchema: SearchFoodDatabaseInputSchema,
    outputSchema: SearchFoodDatabaseOutputSchema,
  },
  async input => {
    const {output} = await searchFoodDatabasePrompt(input);
    return output!;
  }
);
