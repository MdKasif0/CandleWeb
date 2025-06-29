'use server';
/**
 * @fileOverview A flow for generating personalized birthday content, including the main message,
 * closing lines, and a secret message.
 *
 * - generateWishContent - Generates a full set of birthday content.
 * - GenerateWishContentInput - The input type for the generateWishContent function.
 * - GenerateWishContentOutput - The return type for the generateWishContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateWishContentInputSchema = z.object({
  toName: z.string().describe('The name of the person receiving the birthday wish.'),
  fromName: z.string().describe('The name of the person sending the birthday wish.'),
});
export type GenerateWishContentInput = z.infer<typeof GenerateWishContentInputSchema>;

const GenerateWishContentOutputSchema = z.object({
  message: z.string().describe('The main, heartfelt, and slightly humorous birthday message (3-4 sentences).'),
  closingMessages: z.array(z.string()).describe('A list of 3-4 short, celebratory one-line closing messages.'),
  secretMessage: z.string().describe('A short, fun, and slightly mysterious secret message for the end of the experience.'),
});
export type GenerateWishContentOutput = z.infer<typeof GenerateWishContentOutputSchema>;

export async function generateWishContent(input: GenerateWishContentInput): Promise<GenerateWishContentOutput> {
  return generateWishContentFlow(input);
}

const generateWishContentPrompt = ai.definePrompt({
  name: 'generateWishContentPrompt',
  input: { schema: GenerateWishContentInputSchema },
  output: { schema: GenerateWishContentOutputSchema },
  prompt: `You are a creative and witty message writer specializing in birthday wishes.
  The message is from '{{fromName}}' to '{{toName}}'.

  Please generate the following content:
  1.  A short, heartfelt, and slightly humorous birthday message (3-4 sentences). Do not include "From {{fromName}}" at the end, just the message itself.
  2.  A list of 3-4 short, encouraging, and celebratory one-line closing messages.
  3.  A short, playful, and slightly mysterious "secret message" for the very end.`,
});

const generateWishContentFlow = ai.defineFlow(
  {
    name: 'generateWishContentFlow',
    inputSchema: GenerateWishContentInputSchema,
    outputSchema: GenerateWishContentOutputSchema,
  },
  async (input) => {
    const { output } = await generateWishContentPrompt(input);
    return output!;
  }
);
