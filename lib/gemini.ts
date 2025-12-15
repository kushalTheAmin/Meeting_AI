/**
 * Google Gemini API client for AI summarization
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Summary, SummaryTemplate } from '@/types';
import { getSummaryPrompt } from './prompts';

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Generate AI summary from transcript
 */
export async function generateSummary(
  transcript: string,
  template: SummaryTemplate = 'meeting'
): Promise<Summary> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = getSummaryPrompt(template, transcript);

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response into structured summary
    return parseSummaryResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Gemini summarization failed: ${error.message}`);
    }
    throw new Error('Gemini summarization failed with unknown error');
  }
}

/**
 * Parse the AI response into structured Summary object
 */
function parseSummaryResponse(response: string): Summary {
  const summary: Summary = {
    overview: '',
    keyPoints: [],
    actionItems: [],
    decisions: [],
    nextSteps: [],
  };

  try {
    // Extract overview (first paragraph or summary section)
    const overviewMatch = response.match(/\*\*(?:Summary|Overview|Quick Summary|Interview Summary|Main Topic Overview)\*\*[:\s]*(.*?)(?=\n\*\*|\n\n|$)/is);
    if (overviewMatch) {
      summary.overview = overviewMatch[1].trim();
    }

    // Extract key points
    const keyPointsMatch = response.match(/\*\*(?:Key Discussion Points|Key Points|Main Points|Key Concepts|Key Responses)\*\*[:\s]*(.*?)(?=\n\*\*|\n\n##|$)/is);
    if (keyPointsMatch) {
      summary.keyPoints = extractBulletPoints(keyPointsMatch[1]);
    }

    // Extract action items
    const actionItemsMatch = response.match(/\*\*(?:Action Items|Tasks)\*\*[:\s]*(.*?)(?=\n\*\*|\n\n##|$)/is);
    if (actionItemsMatch) {
      summary.actionItems = extractBulletPoints(actionItemsMatch[1]);
    }

    // Extract decisions
    const decisionsMatch = response.match(/\*\*(?:Decisions Made|Decisions)\*\*[:\s]*(.*?)(?=\n\*\*|\n\n##|$)/is);
    if (decisionsMatch) {
      summary.decisions = extractBulletPoints(decisionsMatch[1]);
    }

    // Extract next steps
    const nextStepsMatch = response.match(/\*\*(?:Next Steps|Follow-up|Suggested Review Topics)\*\*[:\s]*(.*?)(?=\n\*\*|\n\n##|$)/is);
    if (nextStepsMatch) {
      summary.nextSteps = extractBulletPoints(nextStepsMatch[1]);
    }

    // If no structured data found, use the entire response as overview
    if (!summary.overview && !summary.keyPoints.length) {
      summary.overview = response.trim();
    }

    return summary;
  } catch (error) {
    // Fallback: use entire response as overview
    return {
      overview: response.trim(),
      keyPoints: [],
      actionItems: [],
      decisions: [],
      nextSteps: [],
    };
  }
}

/**
 * Extract bullet points from text
 */
function extractBulletPoints(text: string): string[] {
  const points: string[] = [];

  // Split by newlines and process each line
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Match bullet points (-, *, •, or numbered)
    const match = trimmed.match(/^(?:[-*•]|\d+\.)\s+(.+)$/);
    if (match) {
      points.push(match[1].trim());
    } else if (trimmed && !trimmed.startsWith('**')) {
      // Include non-empty lines that aren't headers
      points.push(trimmed);
    }
  }

  return points.filter(p => p.length > 0);
}

/**
 * Generate summary with retry logic
 */
export async function generateSummaryWithRetry(
  transcript: string,
  template: SummaryTemplate = 'meeting',
  maxRetries: number = 3
): Promise<Summary> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await generateSummary(transcript, template);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Summarization failed after retries');
}

/**
 * Test Gemini API connection
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Test');
    const response = result.response.text();
    return !!response;
  } catch {
    return false;
  }
}
