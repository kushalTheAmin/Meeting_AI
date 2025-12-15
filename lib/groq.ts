/**
 * Groq API client for audio transcription using Whisper
 */

import Groq from 'groq-sdk';
import type { TranscriptionResult } from '@/types';

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  throw new Error('GROQ_API_KEY environment variable is not set');
}

const groq = new Groq({
  apiKey: groqApiKey,
});

/**
 * Transcribe audio using Groq Whisper API
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string = 'audio.webm'
): Promise<TranscriptionResult> {
  try {
    // Create a File-like object from the buffer
    // Convert Buffer to Uint8Array to ensure compatibility
    const uint8Array = new Uint8Array(audioBuffer);
    const file = new File([uint8Array], filename, {
      type: 'audio/webm',
    });

    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: 'whisper-large-v3',
      response_format: 'verbose_json',
      language: 'en',
      temperature: 0.0,
    });

    // Type assertion for properties not in the type definition
    const transcriptionAny = transcription as {
      text: string;
      duration?: number;
      language?: string;
      segments?: Array<{ start: number; end: number; text: string }>;
    };

    return {
      transcript: transcription.text,
      duration: transcriptionAny.duration || 0,
      language: transcriptionAny.language || 'en',
      segments: transcriptionAny.segments?.map((seg) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text,
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Groq transcription failed: ${error.message}`);
    }
    throw new Error('Groq transcription failed with unknown error');
  }
}

/**
 * Transcribe audio with retry logic
 */
export async function transcribeAudioWithRetry(
  audioBuffer: Buffer,
  filename: string = 'audio.webm',
  maxRetries: number = 3
): Promise<TranscriptionResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await transcribeAudio(audioBuffer, filename);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Transcription failed after retries');
}

/**
 * Test Groq API connection
 */
export async function testGroqConnection(): Promise<boolean> {
  try {
    // Test with a simple completion
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Test' }],
      model: 'mixtral-8x7b-32768',
      max_tokens: 5,
    });

    return !!completion.choices[0]?.message?.content;
  } catch {
    return false;
  }
}
