/**
 * Export functionality component
 */

'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import type { Recording } from '@/types';

interface ExportButtonProps {
  recording: Recording;
  className?: string;
}

type ExportFormat = 'txt' | 'md' | 'json';

export function ExportButton({ recording, className = '' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportAsText = (recording: Recording): string => {
    let content = `${recording.title}\n`;
    content += `Created: ${new Date(recording.created_at).toLocaleString()}\n`;
    content += `Duration: ${Math.floor(recording.duration)}s\n`;
    content += `Template: ${recording.template_used}\n\n`;

    if (recording.summary) {
      content += `SUMMARY\n${'='.repeat(50)}\n`;
      content += `${recording.summary.overview}\n\n`;

      if (recording.summary.keyPoints.length > 0) {
        content += `Key Points:\n`;
        content += recording.summary.keyPoints.map((p) => `- ${p}`).join('\n');
        content += '\n\n';
      }

      if (recording.summary.actionItems.length > 0) {
        content += `Action Items:\n`;
        content += recording.summary.actionItems.map((a) => `- ${a}`).join('\n');
        content += '\n\n';
      }

      if (recording.summary.decisions.length > 0) {
        content += `Decisions:\n`;
        content += recording.summary.decisions.map((d) => `- ${d}`).join('\n');
        content += '\n\n';
      }
    }

    if (recording.transcript) {
      content += `TRANSCRIPT\n${'='.repeat(50)}\n`;
      content += recording.transcript;
    }

    return content;
  };

  const exportAsMarkdown = (recording: Recording): string => {
    let content = `# ${recording.title}\n\n`;
    content += `**Created:** ${new Date(recording.created_at).toLocaleString()}\n`;
    content += `**Duration:** ${Math.floor(recording.duration)}s\n`;
    content += `**Template:** ${recording.template_used}\n\n`;

    if (recording.summary) {
      content += `## Summary\n\n`;
      content += `${recording.summary.overview}\n\n`;

      if (recording.summary.keyPoints.length > 0) {
        content += `### Key Points\n\n`;
        content += recording.summary.keyPoints.map((p) => `- ${p}`).join('\n');
        content += '\n\n';
      }

      if (recording.summary.actionItems.length > 0) {
        content += `### Action Items\n\n`;
        content += recording.summary.actionItems.map((a) => `- ${a}`).join('\n');
        content += '\n\n';
      }

      if (recording.summary.decisions.length > 0) {
        content += `### Decisions\n\n`;
        content += recording.summary.decisions.map((d) => `- ${d}`).join('\n');
        content += '\n\n';
      }
    }

    if (recording.transcript) {
      content += `## Transcript\n\n`;
      content += recording.transcript;
    }

    return content;
  };

  const exportAsJSON = (recording: Recording): string => {
    return JSON.stringify(recording, null, 2);
  };

  const handleExport = (format: ExportFormat) => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'txt':
        content = exportAsText(recording);
        filename = `${recording.title.replace(/\s+/g, '_')}.txt`;
        mimeType = 'text/plain';
        break;
      case 'md':
        content = exportAsMarkdown(recording);
        filename = `${recording.title.replace(/\s+/g, '_')}.md`;
        mimeType = 'text/markdown';
        break;
      case 'json':
        content = exportAsJSON(recording);
        filename = `${recording.title.replace(/\s+/g, '_')}.json`;
        mimeType = 'application/json';
        break;
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        aria-label="Export recording"
        aria-expanded={isOpen}
      >
        <Download size={16} />
        <span>Export</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-20">
            <div className="py-1">
              <button
                onClick={() => handleExport('txt')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors"
              >
                Export as TXT
              </button>
              <button
                onClick={() => handleExport('md')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors"
              >
                Export as Markdown
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors"
              >
                Export as JSON
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
