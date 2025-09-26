'use server';

/**
 * @fileOverview Resolves a food name to its most common English equivalent.
 *
 * - resolveFoodName - A function that resolves food name variations.
 * - ResolveFoodNameInput - The input type for the resolveFoodName function.
 * - ResolveFoodNameOutput - The return type for the resolveFoodName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResolveFoodNameInputSchema = z.object({
  foodName: z
    .string()
    .describe('A food name that may be regional, colloquial, or in a different language (e.g., "chapati", "besan", "paneer").'),
});
export type ResolveFoodNameInput = z.infer<typeof ResolveFoodNameInputSchema>;

const ResolveFoodNameOutputSchema = z.object({
  standardName: z
    .string()
    .describe('The most common, standard English name for the food item, suitable for a US-based nutrition database (e.g., "Roti", "Chickpea Flour", "Cottage Cheese").'),
});
export type ResolveFoodNameOutput = z.infer<typeof ResolveFoodNameOutputSchema>;


export async function resolveFoodName(
  input: ResolveFoodNameInput
): Promise<ResolveFoodNameOutput> {
  return resolveFoodNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resolveFoodNamePrompt',
  input: {schema: ResolveFoodNameInputSchema},
  output: {schema: ResolveFoodNameOutputSchema},
  prompt: `You are an expert in world cuisines and food terminology. Your task is to resolve a given food name into its most common, standard English equivalent that would be understood by a US-based nutrition database like Nutritionix.

- If the food is Indian, provide the most common English name or the most widely used term.
- If the food name is already in standard English, return it as is.
- Focus only on the name of the food, not its quantity or preparation method.

Examples:
- "Chapati" -> "Roti"
- "Besan" -> "Chickpea Flour"
- "Paneer" -> "Indian Cottage Cheese"
- "Brinjal" -> "Eggplant"
- "Dosa" -> "Dosa" (as it's a common name)
- "Apple" -> "Apple"

Food name to resolve: {{{foodName}}}`,
});

const resolveFoodNameFlow = ai.defineFlow(
  {
    name: 'resolveFoodNameFlow',
    inputSchema: ResolveFoodNameInputSchema,
    outputSchema: ResolveFoodNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
