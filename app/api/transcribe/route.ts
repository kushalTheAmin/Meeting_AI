/**
 * API route for audio transcription using Groq Whisper
 */

import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudioWithRetry } from '@/lib/groq';
import type { TranscribeRequest, APIError } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: TranscribeRequest = await request.json();
    const { audioBase64, format } = body;

    // Validate input
    if (!audioBase64) {
      return NextResponse.json<APIError>(
        { error: 'Missing audio data' },
        { status: 400 }
      );
    }

    if (!format) {
      return NextResponse.json<APIError>(
        { error: 'Missing audio format' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    // Validate buffer size (max 25MB)
    if (audioBuffer.length > 25 * 1024 * 1024) {
      return NextResponse.json<APIError>(
        { error: 'Audio file too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // Transcribe with Groq
    const filename = `audio.${format}`;
    const result = await transcribeAudioWithRetry(audioBuffer, filename);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Transcription error:', error);

    if (error instanceof Error) {
      return NextResponse.json<APIError>(
        {
          error: 'Transcription failed',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<APIError>(
      { error: 'Transcription failed with unknown error' },
      { status: 500 }
    );
  }
}
