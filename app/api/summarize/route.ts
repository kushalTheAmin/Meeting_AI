/**
 * API route for AI summarization using Google Gemini
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateSummaryWithRetry } from '@/lib/gemini';
import type { SummarizeRequest, APIError } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SummarizeRequest = await request.json();
    const { transcript, template } = body;

    // Validate input
    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json<APIError>(
        { error: 'Missing or empty transcript' },
        { status: 400 }
      );
    }

    if (!template) {
      return NextResponse.json<APIError>(
        { error: 'Missing template type' },
        { status: 400 }
      );
    }

    // Validate template
    const validTemplates = ['meeting', 'interview', 'lecture', 'memo'];
    if (!validTemplates.includes(template)) {
      return NextResponse.json<APIError>(
        { error: `Invalid template. Must be one of: ${validTemplates.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate summary with Gemini
    const summary = await generateSummaryWithRetry(transcript, template);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Summarization error:', error);

    if (error instanceof Error) {
      return NextResponse.json<APIError>(
        {
          error: 'Summarization failed',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<APIError>(
      { error: 'Summarization failed with unknown error' },
      { status: 500 }
    );
  }
}
