'use server';

/**
 * @fileOverview Identifies food items from a photo.
 *
 * - identifyFoodFromPhoto - A function that identifies food items from a photo.
 * - IdentifyFoodFromPhotoInput - The input type for the identifyFoodFromPhoto function.
 * - IdentifyFoodFromPhotoOutput - The return type for the identifyFoodFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyFoodFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyFoodFromPhotoInput = z.infer<typeof IdentifyFoodFromPhotoInputSchema>;

const IdentifiedFoodItemSchema = z.object({
    foodName: z.string().describe('The name of the identified food item (e.g., "Boiled Egg", "Roti").'),
    quantity: z.string().describe('The estimated quantity of the food item (e.g., "2 large", "1 piece").'),
});

const IdentifyFoodFromPhotoOutputSchema = z.object({
  foodItems: z
    .array(IdentifiedFoodItemSchema)
    .describe('An array of food items identified from the photo.'),
});
export type IdentifyFoodFromPhotoOutput = z.infer<
  typeof IdentifyFoodFromPhotoOutputSchema
>;

export async function identifyFoodFromPhoto(
  input: IdentifyFoodFromPhotoInput
): Promise<IdentifyFoodFromPhotoOutput> {
  return identifyFoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyFoodPrompt',
  input: {schema: IdentifyFoodFromPhotoInputSchema},
  output: {schema: IdentifyFoodFromPhotoOutputSchema},
  prompt: `You are an expert at identifying food items from images. Analyze the provided image of a meal and identify all the distinct food items present.

For each food item you identify, provide its name and an estimated quantity.

Here is the photo of the meal:
{{media url=photoDataUri}}`,
});

const identifyFoodFlow = ai.defineFlow(
  {
    name: 'identifyFoodFlow',
    inputSchema: IdentifyFoodFromPhotoInputSchema,
    outputSchema: IdentifyFoodFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
