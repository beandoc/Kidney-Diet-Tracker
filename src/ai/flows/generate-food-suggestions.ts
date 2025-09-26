'use server';

/**
 * @fileOverview Provides food suggestions based on dietary restrictions.
 *
 * - generateFoodSuggestions - A function that suggests food items low in specified nutrients.
 * - GenerateFoodSuggestionsInput - The input type for the generateFoodSuggestions function.
 * - GenerateFoodSuggestionsOutput - The return type for the generateFoodSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFoodSuggestionsInputSchema = z.object({
  nutrient: z
    .string()
    .describe(
      'The nutrient to minimize in food suggestions (e.g., sodium, potassium, phosphorus).'
    ),
  dietaryRestrictions: z
    .string()
    .describe('Any additional dietary restrictions (e.g., vegetarian, gluten-free).'),
  numberOfSuggestions: z
    .number()
    .default(5)
    .describe('The number of food suggestions to generate.'),
});
export type GenerateFoodSuggestionsInput = z.infer<
  typeof GenerateFoodSuggestionsInputSchema
>;

const GenerateFoodSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of food suggestions that are low in the specified nutrient.'),
});
export type GenerateFoodSuggestionsOutput = z.infer<
  typeof GenerateFoodSuggestionsOutputSchema
>;

export async function generateFoodSuggestions(
  input: GenerateFoodSuggestionsInput
): Promise<GenerateFoodSuggestionsOutput> {
  return generateFoodSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFoodSuggestionsPrompt',
  input: {schema: GenerateFoodSuggestionsInputSchema},
  output: {schema: GenerateFoodSuggestionsOutputSchema},
  prompt: `You are a nutritionist specializing in kidney diets. Based on the user's dietary restrictions, suggest {number of suggestions} food items that are low in the specified nutrient.

Nutrient to minimize: {{{nutrient}}}
Dietary restrictions: {{{dietaryRestrictions}}}

Suggestions:`, //Ensure the prompt is closed with "Suggestions:"
});

const generateFoodSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateFoodSuggestionsFlow',
    inputSchema: GenerateFoodSuggestionsInputSchema,
    outputSchema: GenerateFoodSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
