/**
 * Transcript display component
 */

'use client';

import React from 'react';
import type { TranscriptionResult } from '@/types';
import { Copy, Check } from 'lucide-react';

interface TranscriptDisplayProps {
  transcript: TranscriptionResult;
  className?: string;
}

export function TranscriptDisplay({
  transcript,
  className = '',
}: TranscriptDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript.transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy transcript:', err);
    }
  };

  return (
    <div className={`bg-secondary/20 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Transcript</h3>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label="Copy transcript"
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {/* Metadata */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Language: {transcript.language.toUpperCase()}</span>
          <span>•</span>
          <span>Duration: {Math.floor(transcript.duration)}s</span>
          {transcript.segments && (
            <>
              <span>•</span>
              <span>{transcript.segments.length} segments</span>
            </>
          )}
        </div>

        {/* Transcript Text */}
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {transcript.transcript}
          </p>
        </div>

        {/* Segments (if available) */}
        {transcript.segments && transcript.segments.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80">
              View Segments ({transcript.segments.length})
            </summary>
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {transcript.segments.map((segment, index) => (
                <div
                  key={index}
                  className="p-2 bg-background rounded text-xs"
                >
                  <div className="text-muted-foreground mb-1">
                    {Math.floor(segment.start)}s - {Math.floor(segment.end)}s
                  </div>
                  <div className="text-foreground">{segment.text}</div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
