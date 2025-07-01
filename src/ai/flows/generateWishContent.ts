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
  blowCandlesInstruction: z.string().describe("A short, one-line instruction to blow out the candles (e.g., 'Make a wish and blow the candles')."),
  wishYouTheBestMessage: z.string().describe("A very short, celebratory message that appears below the main cake greeting (e.g., 'Wishing you the best!')."),
  letsBlowCandlesTitle: z.string().describe("A short title for the candle blowing pop-up (e.g., \"Ready to make a wish?\")."),
  thanksForWatchingTitle: z.string().describe("A short title for the final pop-up (e.g., 'Thanks for watching!')."),
  didYouLikeItMessage: z.string().describe("A short question for the final pop-up asking for feedback (e.g., 'Hope you liked it!')."),
  endMessage: z.string().describe("A very short message to signify the end (e.g., 'The End')."),
  specialGiftMessage: z.string().describe("A short, heartfelt message for the 'Special Gift' card. (e.g., 'May every moment of your special day be filled with the same joy and happiness you bring to others!')"),
  saveKeepsakeMessage: z.string().describe("A short, instructional message for the 'Save Keepsake' button. (e.g., 'Save this memory forever.')")
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

  Please generate the following content. Keep all one-line messages very short and celebratory.
  1.  A short, heartfelt, and slightly humorous birthday message (3-4 sentences). Do not include "From {{fromName}}" at the end, just the message itself.
  2.  A list of 3-4 short, encouraging, and celebratory one-line closing messages.
  3.  A short, playful, and slightly mysterious "secret message" for the very end.
  4.  A short instruction to blow out the candles (e.g., 'Make a wish and blow the candles').
  5.  A very short, celebratory message that appears below the main cake greeting (e.g., 'Wishing you the best!').
  6.  A short title for the candle blowing pop-up (e.g., "Ready to make a wish?").
  7.  A short title for the final pop-up (e.g., "Thanks for watching!").
  8.  A short question for the final pop-up asking for feedback (e.g., "Hope you liked it!").
  9.  A very short message to signify the end (e.g., "The End").
  10. A heartfelt message for the 'Special Gift' card, like 'May your day be as joyful as you make others'.
  11. A short message for the 'Save Keepsake' button, like 'Save this memory forever.'`,
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
