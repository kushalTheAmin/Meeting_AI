/**
 * Custom hook for managing recordings
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Recording, Summary, SummaryTemplate } from '@/types';
import { uploadAudioFile, generateRecordingFilename } from '@/lib/audio-utils';

interface UseRecordingsResult {
  recordings: Recording[];
  isLoading: boolean;
  error: string | null;
  saveRecording: (
    audioBlob: Blob,
    transcript: string,
    summary: Summary,
    duration: number,
    template: SummaryTemplate,
    title?: string
  ) => Promise<Recording>;
  fetchRecordings: () => Promise<void>;
  deleteRecording: (id: string) => Promise<void>;
  searchRecordings: (query: string) => Promise<void>;
}

export function useRecordings(): UseRecordingsResult {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all recordings
   */
  const fetchRecordings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/recordings');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch recordings');
      }

      const data: Recording[] = await response.json();
      setRecordings(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch recordings';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save a new recording
   */
  const saveRecording = useCallback(
    async (
      audioBlob: Blob,
      transcript: string,
      summary: Summary,
      duration: number,
      template: SummaryTemplate,
      title?: string
    ): Promise<Recording> => {
      try {
        setIsLoading(true);
        setError(null);

        // Generate a title if not provided
        const recordingTitle =
          title ||
          `Recording ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

        // Generate filename and upload audio to Supabase
        const filename = generateRecordingFilename();
        const audioUrl = await uploadAudioFile(audioBlob, filename);

        // Save recording to database
        const response = await fetch('/api/recordings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: recordingTitle,
            transcript: transcript,
            summary: summary,
            duration: duration,
            audio_url: audioUrl,
            template_used: template,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to save recording');
        }

        const recording: Recording = await response.json();

        // Add to local state
        setRecordings((prev) => [recording, ...prev]);

        return recording;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to save recording';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Delete a recording
   */
  const deleteRecording = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/recordings?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete recording');
      }

      // Remove from local state
      setRecordings((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete recording';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Search recordings
   */
  const searchRecordings = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/recordings?search=${encodeURIComponent(query)}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search recordings');
      }

      const data: Recording[] = await response.json();
      setRecordings(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to search recordings';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load recordings on mount
  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  return {
    recordings,
    isLoading,
    error,
    saveRecording,
    fetchRecordings,
    deleteRecording,
    searchRecordings,
  };
}
