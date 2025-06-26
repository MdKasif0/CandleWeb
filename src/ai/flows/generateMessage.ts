'use server';
/**
 * @fileOverview A flow for generating personalized birthday messages.
 *
 * - generateMessage - Generates a birthday message based on sender and recipient names.
 * - GenerateMessageInput - The input type for the generateMessage function.
 * - GenerateMessageOutput - The return type for the generateMessage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateMessageInputSchema = z.object({
  toName: z.string().describe('The name of the person receiving the birthday wish.'),
  fromName: z.string().describe('The name of the person sending the birthday wish.'),
});
export type GenerateMessageInput = z.infer<typeof GenerateMessageInputSchema>;

export const GenerateMessageOutputSchema = z.object({
  message: z.string().describe('The generated birthday message.'),
});
export type GenerateMessageOutput = z.infer<typeof GenerateMessageOutputSchema>;

export async function generateMessage(input: GenerateMessageInput): Promise<GenerateMessageOutput> {
  return generateMessageFlow(input);
}

const generateMessagePrompt = ai.definePrompt({
  name: 'generateMessagePrompt',
  input: { schema: GenerateMessageInputSchema },
  output: { schema: GenerateMessageOutputSchema },
  prompt: `You are a creative and witty message writer specializing in birthday wishes.
  Generate a short, heartfelt, and slightly humorous birthday message.
  The message is from '{{fromName}}' to '{{toName}}'.
  The message should be no more than 3-4 sentences.
  Do not include "From {{fromName}}" at the end, just the message itself.`,
});

const generateMessageFlow = ai.defineFlow(
  {
    name: 'generateMessageFlow',
    inputSchema: GenerateMessageInputSchema,
    outputSchema: GenerateMessageOutputSchema,
  },
  async (input) => {
    const { output } = await generateMessagePrompt(input);
    return output!;
  }
);
