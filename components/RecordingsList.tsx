/**
 * Recordings list component for history page
 */

'use client';

import React from 'react';
import { Trash2, Clock, Calendar } from 'lucide-react';
import type { Recording } from '@/types';
import { formatDuration } from '@/lib/audio-utils';
import { ExportButton } from './ExportButton';

interface RecordingsListProps {
  recordings: Recording[];
  onDelete: (id: string) => void;
  onSelect?: (recording: Recording) => void;
  className?: string;
}

export function RecordingsList({
  recordings,
  onDelete,
  onSelect,
  className = '',
}: RecordingsListProps) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this recording?')) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (recordings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No recordings yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start recording to create your first voice note
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {recordings.map((recording) => (
        <div
          key={recording.id}
          className="bg-secondary/20 rounded-lg p-4 hover:bg-secondary/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Recording Info */}
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onSelect?.(recording)}
            >
              <h3 className="font-semibold text-foreground mb-2">
                {recording.title}
              </h3>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(recording.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDuration(recording.duration)}
                </span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                  {recording.template_used}
                </span>
              </div>

              {/* Summary Preview */}
              {recording.summary?.overview && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {recording.summary.overview}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ExportButton recording={recording} />

              <button
                onClick={() => handleDelete(recording.id)}
                disabled={deletingId === recording.id}
                className="flex items-center justify-center w-9 h-9 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
                aria-label="Delete recording"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Audio Player (if URL exists) */}
          {recording.audio_url && (
            <div className="mt-3">
              <audio
                src={recording.audio_url}
                controls
                className="w-full h-10"
                preload="metadata"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
