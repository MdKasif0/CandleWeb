"use server";

import { summarizeText } from "@/ai/flows/summarize-text";
import { summarizeUrl } from "@/ai/flows/summarize-url";

/**
 * A helper function to strip HTML tags and extra whitespace from a string.
 * This is used to extract plain text from fetched web pages.
 * @param html The HTML string to clean.
 * @returns The cleaned text content.
 */
function cleanHtml(html: string): string {
  return html
    // Remove script and style elements
    .replace(/<script[^>]*>.*<\/script>/gs, "")
    .replace(/<style[^>]*>.*<\/style>/gs, "")
    // Remove all HTML tags
    .replace(/<[^>]+>/g, "")
    // Remove extra whitespace
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function handleUrlSummarization(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const htmlContent = await response.text();
    const textContent = cleanHtml(htmlContent);

    if (!textContent) {
      throw new Error("Could not extract any text content from the URL.");
    }
    
    // The model works best with a reasonable amount of text.
    const truncatedContent = textContent.slice(0, 15000);

    const result = await summarizeUrl({ url: url, fetchedContent: truncatedContent });
    return { summary: result.summary, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : "An unknown error occurred.";
    console.error(error);
    return { summary: null, error };
  }
}

export async function handleTextSummarization(text: string) {
  try {
    const summary = await summarizeText(text);
    return { summary: summary, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : "An unknown error occurred.";
    console.error(error);
    return { summary: null, error };
  }
}
