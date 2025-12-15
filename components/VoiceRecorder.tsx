/**
 * Main voice recorder component
 */

'use client';

import React, { useState } from 'react';
import { Mic, Square, X, Save } from 'lucide-react';
import { useRecorder } from '@/hooks/useRecorder';
import { useTranscription } from '@/hooks/useTranscription';
import { useRecordings } from '@/hooks/useRecordings';
import { AudioPlayer } from './AudioPlayer';
import { TranscriptDisplay } from './TranscriptDisplay';
import { SummaryDisplay } from './SummaryDisplay';
import { TemplateSelector } from './TemplateSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { formatDuration } from '@/lib/audio-utils';
import type { SummaryTemplate } from '@/types';

export function VoiceRecorder() {
  const [selectedTemplate, setSelectedTemplate] = useState<SummaryTemplate>('meeting');
  const [recordingTitle, setRecordingTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const recorder = useRecorder();
  const transcription = useTranscription();
  const recordings = useRecordings();

  const handleStartRecording = async () => {
    try {
      await recorder.startRecording();
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const handleStopRecording = () => {
    recorder.stopRecording();
  };

  const handleCancelRecording = () => {
    recorder.cancelRecording();
    transcription.reset();
  };

  const handleProcessRecording = async () => {
    if (!recorder.audioBlob) {
      return;
    }

    try {
      // Step 1: Transcribe audio
      const transcriptResult = await transcription.transcribe(recorder.audioBlob);

      // Step 2: Generate summary
      await transcription.summarize(transcriptResult.transcript, selectedTemplate);
    } catch (err) {
      console.error('Failed to process recording:', err);
    }
  };

  const handleSaveRecording = async () => {
    if (!recorder.audioBlob || !transcription.transcript || !transcription.summary) {
      return;
    }

    try {
      setIsSaving(true);

      await recordings.saveRecording(
        recorder.audioBlob,
        transcription.transcript.transcript,
        transcription.summary,
        recorder.duration,
        selectedTemplate,
        recordingTitle || undefined
      );

      // Reset everything
      recorder.resetRecording();
      transcription.reset();
      setRecordingTitle('');

      alert('Recording saved successfully!');
    } catch (err) {
      console.error('Failed to save recording:', err);
      alert('Failed to save recording. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewRecording = () => {
    recorder.resetRecording();
    transcription.reset();
    setRecordingTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {recorder.error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          {recorder.error}
        </div>
      )}

      {transcription.transcriptionError && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          {transcription.transcriptionError}
        </div>
      )}

      {transcription.summarizationError && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          {transcription.summarizationError}
        </div>
      )}

      {/* Recording Controls */}
      {!recorder.audioURL && (
        <div className="bg-secondary/20 rounded-lg p-8">
          <div className="flex flex-col items-center gap-6">
            {/* Recording Button */}
            <button
              onClick={recorder.isRecording ? handleStopRecording : handleStartRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                recorder.isRecording
                  ? 'bg-destructive hover:bg-destructive/90 animate-pulse'
                  : 'bg-primary hover:bg-primary/90'
              }`}
              aria-label={recorder.isRecording ? 'Stop recording' : 'Start recording'}
            >
              {recorder.isRecording ? (
                <Square size={36} className="text-primary-foreground" />
              ) : (
                <Mic size={36} className="text-primary-foreground" />
              )}
            </button>

            {/* Status Text */}
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {recorder.isRecording ? 'Recording...' : 'Ready to Record'}
              </p>
              {recorder.isRecording && (
                <p className="text-3xl font-mono font-bold text-primary mt-2">
                  {formatDuration(recorder.duration)}
                </p>
              )}
              {!recorder.isRecording && (
                <p className="text-sm text-muted-foreground mt-2">
                  Click the microphone to start recording
                </p>
              )}
            </div>

            {/* Cancel Button (when recording) */}
            {recorder.isRecording && (
              <button
                onClick={handleCancelRecording}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Audio Playback and Processing */}
      {recorder.audioURL && !transcription.transcript && (
        <div className="space-y-4">
          <AudioPlayer audioURL={recorder.audioURL} />

          <TemplateSelector
            selected={selectedTemplate}
            onChange={setSelectedTemplate}
          />

          <div className="flex gap-3">
            <button
              onClick={handleProcessRecording}
              disabled={transcription.isTranscribing || transcription.isSummarizing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {transcription.isTranscribing || transcription.isSummarizing ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Transcribe & Summarize</span>
              )}
            </button>

            <button
              onClick={handleCancelRecording}
              className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Processing States */}
      {transcription.isTranscribing && (
        <div className="bg-secondary/20 rounded-lg p-8 flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" message="Transcribing audio..." />
        </div>
      )}

      {transcription.isSummarizing && (
        <div className="bg-secondary/20 rounded-lg p-8 flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" message="Generating AI summary..." />
        </div>
      )}

      {/* Results */}
      {transcription.transcript && transcription.summary && (
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="recording-title" className="block text-sm font-medium text-foreground mb-2">
              Recording Title (optional)
            </label>
            <input
              id="recording-title"
              type="text"
              value={recordingTitle}
              onChange={(e) => setRecordingTitle(e.target.value)}
              placeholder={`Recording ${new Date().toLocaleDateString()}`}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Audio Player */}
          {recorder.audioURL && <AudioPlayer audioURL={recorder.audioURL} />}

          {/* Transcript */}
          <TranscriptDisplay transcript={transcription.transcript} />

          {/* Summary */}
          <SummaryDisplay summary={transcription.summary} />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSaveRecording}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Recording</span>
                </>
              )}
            </button>

            <button
              onClick={handleNewRecording}
              className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              New Recording
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
