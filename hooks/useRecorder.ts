/**
 * Custom hook for audio recording functionality
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { RecorderState } from '@/types';
import {
  requestMicrophonePermission,
  checkAudioSupport,
  getAudioMimeType,
} from '@/lib/audio-utils';

export function useRecorder() {
  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioURL: null,
    audioBlob: null,
  });

  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start recording
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Check browser support
      const support = checkAudioSupport();
      if (!support.supported) {
        throw new Error(support.error);
      }

      // Request microphone permission
      const stream = await requestMicrophonePermission();
      streamRef.current = stream;

      // Create MediaRecorder
      const mimeType = getAudioMimeType('webm');
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);

        setState((prev) => ({
          ...prev,
          audioURL: url,
          audioBlob: blob,
          isRecording: false,
        }));

        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;

      // Start timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setState((prev) => ({ ...prev, duration: elapsed }));

        // Stop at 10 minutes (600 seconds)
        if (elapsed >= 600) {
          stopRecording();
        }
      }, 100);

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioURL: null,
        audioBlob: null,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [state.isRecording]);

  /**
   * Pause recording
   */
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause();
      setState((prev) => ({ ...prev, isPaused: true }));

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [state.isRecording, state.isPaused]);

  /**
   * Resume recording
   */
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume();
      setState((prev) => ({ ...prev, isPaused: false }));

      // Resume timer
      const currentDuration = state.duration;
      const startTime = Date.now() - currentDuration * 1000;

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setState((prev) => ({ ...prev, duration: elapsed }));

        // Stop at 10 minutes
        if (elapsed >= 600) {
          stopRecording();
        }
      }, 100);
    }
  }, [state.isRecording, state.isPaused, state.duration, stopRecording]);

  /**
   * Cancel recording
   */
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      setState({
        isRecording: false,
        isPaused: false,
        duration: 0,
        audioURL: null,
        audioBlob: null,
      });

      chunksRef.current = [];
    }
  }, []);

  /**
   * Reset state
   */
  const resetRecording = useCallback(() => {
    if (state.audioURL) {
      URL.revokeObjectURL(state.audioURL);
    }

    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioURL: null,
      audioBlob: null,
    });

    setError(null);
  }, [state.audioURL]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (state.audioURL) {
        URL.revokeObjectURL(state.audioURL);
      }
    };
  }, [state.audioURL]);

  return {
    ...state,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    resetRecording,
  };
}
