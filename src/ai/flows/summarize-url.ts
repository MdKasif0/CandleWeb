'use server';

/**
 * @fileOverview Summarizes the text content of a URL, focusing on key entities.
 *
 * - summarizeUrl - A function that handles the URL summarization process.
 * - SummarizeUrlInput - The input type for the summarizeUrl function.
 * - SummarizeUrlOutput - The return type for the summarizeUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUrlInputSchema = z.object({
  url: z.string().url().describe('The URL to summarize.'),
  fetchedContent: z.string().describe('The content fetched from the URL.')
});
export type SummarizeUrlInput = z.infer<typeof SummarizeUrlInputSchema>;

const SummarizeUrlOutputSchema = z.object({
  summary: z.string().describe('The summarized text content of the URL, focusing on key entities.'),
});
export type SummarizeUrlOutput = z.infer<typeof SummarizeUrlOutputSchema>;

export async function summarizeUrl(input: SummarizeUrlInput): Promise<SummarizeUrlOutput> {
  return summarizeUrlFlow(input);
}

const summarizeUrlPrompt = ai.definePrompt({
  name: 'summarizeUrlPrompt',
  input: {schema: SummarizeUrlInputSchema},
  output: {schema: SummarizeUrlOutputSchema},
  prompt: `Summarize the following text, focusing on key entities mentioned:\n\n{{{fetchedContent}}}`, // Ensure `fetchedContent` is used here, not `text`
});

const summarizeUrlFlow = ai.defineFlow(
  {
    name: 'summarizeUrlFlow',
    inputSchema: SummarizeUrlInputSchema,
    outputSchema: SummarizeUrlOutputSchema,
  },
  async input => {
    const {output} = await summarizeUrlPrompt(input);
    return output!;
  }
);
