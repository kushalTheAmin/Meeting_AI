/**
 * Main page - Voice recording interface
 */

'use client';

import React from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Mic } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Mic size={32} className="text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Voice Notes AI
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Record your voice, get AI-powered transcriptions and summaries instantly.
          Perfect for meetings, interviews, lectures, and voice memos.
        </p>
      </div>

      {/* Voice Recorder Component */}
      <div className="animate-fadeIn">
        <VoiceRecorder />
      </div>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-secondary/20 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">
            🎙️ High-Quality Recording
          </h3>
          <p className="text-sm text-muted-foreground">
            Record crystal-clear audio up to 10 minutes with browser-based recording
          </p>
        </div>

        <div className="bg-secondary/20 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">
            ✨ AI Transcription
          </h3>
          <p className="text-sm text-muted-foreground">
            Powered by Groq Whisper for accurate, fast transcriptions
          </p>
        </div>

        <div className="bg-secondary/20 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">
            📝 Smart Summaries
          </h3>
          <p className="text-sm text-muted-foreground">
            Google Gemini AI extracts key points, action items, and decisions
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-accent/20 border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-3">How to Use</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Click the microphone button to start recording</li>
          <li>Speak clearly - you can record up to 10 minutes</li>
          <li>Click stop when finished</li>
          <li>Choose a summary template (meeting, interview, lecture, or memo)</li>
          <li>Click &quot;Transcribe & Summarize&quot; to process</li>
          <li>Review, edit the title if needed, and save your recording</li>
        </ol>
      </div>
    </div>
  );
}
