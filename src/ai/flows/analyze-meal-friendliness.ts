// This is a server-side file.
'use server';

/**
 * @fileOverview Analyzes a meal and provides feedback on how kidney-friendly it is.
 *
 * - analyzeMealForKidneyFriendliness - A function that analyzes the meal.
 * - AnalyzeMealInput - The input type for the analyzeMealForKidneyFriendliness function.
 * - AnalyzeMealOutput - The return type for the analyzeMealForKidneyFriendliness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMealInputSchema = z.object({
  mealDescription: z
    .string()
    .describe('A description of the meal, including all food items and quantities.'),
});
export type AnalyzeMealInput = z.infer<typeof AnalyzeMealInputSchema>;

const AnalyzeMealOutputSchema = z.object({
  isKidneyFriendly: z
    .boolean()
    .describe('Whether the meal is generally kidney-friendly.'),
  concerns: z
    .array(z.string())
    .describe(
      'Any specific concerns about the meal, such as high sodium, potassium, or phosphorus levels.'
    ),
  suggestions: z
    .string()
    .describe(
      'Suggestions for how to make the meal more kidney-friendly, if applicable.'
    ),
});
export type AnalyzeMealOutput = z.infer<typeof AnalyzeMealOutputSchema>;

export async function analyzeMealForKidneyFriendliness(
  input: AnalyzeMealInput
): Promise<AnalyzeMealOutput> {
  return analyzeMealFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMealPrompt',
  input: {schema: AnalyzeMealInputSchema},
  output: {schema: AnalyzeMealOutputSchema},
  prompt: `You are a registered dietitian specializing in kidney disease.

You will analyze the meal provided by the user and determine how kidney-friendly it is.

You will consider the sodium, potassium, and phosphorus levels of the meal, as well as other factors that may be relevant to kidney health.

Based on your analysis, you will provide feedback to the user, including:

- Whether the meal is generally kidney-friendly (isKidneyFriendly).
- Any specific concerns about the meal, such as high sodium, potassium, or phosphorus levels (concerns).
- Suggestions for how to make the meal more kidney-friendly, if applicable (suggestions).

Here is the meal description:
{{{mealDescription}}}`,
});

const analyzeMealFlow = ai.defineFlow(
  {
    name: 'analyzeMealFlow',
    inputSchema: AnalyzeMealInputSchema,
    outputSchema: AnalyzeMealOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
