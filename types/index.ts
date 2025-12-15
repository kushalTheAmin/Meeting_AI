/**
 * Core type definitions for the Voice Notes AI application
 */

export interface Recording {
  id: string;
  created_at: string;
  title: string;
  transcript: string | null;
  summary: Summary | null;
  duration: number;
  audio_url: string | null;
  template_used: string;
  metadata?: Record<string, unknown>;
}

export interface Summary {
  overview: string;
  keyPoints: string[];
  actionItems: string[];
  decisions: string[];
  nextSteps?: string[];
}

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  transcript: string;
  duration: number;
  language: string;
  segments?: TranscriptionSegment[];
}

export type SummaryTemplate = 'meeting' | 'interview' | 'lecture' | 'memo';

export interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioURL: string | null;
  audioBlob: Blob | null;
}

export interface APIError {
  error: string;
  details?: string;
  code?: number;
}

export interface TranscribeRequest {
  audioBase64: string;
  format: string;
}

export interface SummarizeRequest {
  transcript: string;
  template: SummaryTemplate;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  message: string;
  timestamp: string;
}
