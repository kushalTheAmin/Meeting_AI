/**
 * Custom hook for audio transcription
 */

'use client';

import { useState, useCallback } from 'react';
import type { TranscriptionResult, Summary, SummaryTemplate } from '@/types';
import { blobToBase64 } from '@/lib/audio-utils';

interface UseTranscriptionResult {
  transcript: TranscriptionResult | null;
  summary: Summary | null;
  isTranscribing: boolean;
  isSummarizing: boolean;
  transcriptionError: string | null;
  summarizationError: string | null;
  transcribe: (audioBlob: Blob) => Promise<TranscriptionResult>;
  summarize: (transcript: string, template: SummaryTemplate) => Promise<Summary>;
  reset: () => void;
}

export function useTranscription(): UseTranscriptionResult {
  const [transcript, setTranscript] = useState<TranscriptionResult | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [summarizationError, setSummarizationError] = useState<string | null>(null);

  /**
   * Transcribe audio blob
   */
  const transcribe = useCallback(async (audioBlob: Blob): Promise<TranscriptionResult> => {
    try {
      setIsTranscribing(true);
      setTranscriptionError(null);

      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);

      // Get file extension from blob type
      const format = audioBlob.type.split('/')[1] || 'webm';

      // Call transcription API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBase64: base64Audio,
          format: format,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Transcription failed');
      }

      const result: TranscriptionResult = await response.json();
      setTranscript(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to transcribe audio';
      setTranscriptionError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  /**
   * Generate summary from transcript
   */
  const summarize = useCallback(
    async (transcriptText: string, template: SummaryTemplate): Promise<Summary> => {
      try {
        setIsSummarizing(true);
        setSummarizationError(null);

        // Call summarization API
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript: transcriptText,
            template: template,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Summarization failed');
        }

        const result: Summary = await response.json();
        setSummary(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to generate summary';
        setSummarizationError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsSummarizing(false);
      }
    },
    []
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setTranscript(null);
    setSummary(null);
    setTranscriptionError(null);
    setSummarizationError(null);
  }, []);

  return {
    transcript,
    summary,
    isTranscribing,
    isSummarizing,
    transcriptionError,
    summarizationError,
    transcribe,
    summarize,
    reset,
  };
}
