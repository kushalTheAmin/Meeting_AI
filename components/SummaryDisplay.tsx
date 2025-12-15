/**
 * AI summary display component
 */

'use client';

import React from 'react';
import type { Summary } from '@/types';
import { Copy, Check } from 'lucide-react';

interface SummaryDisplayProps {
  summary: Summary;
  className?: string;
}

export function SummaryDisplay({ summary, className = '' }: SummaryDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const formatSummaryAsText = (summary: Summary): string => {
    let text = `Summary:\n${summary.overview}\n\n`;

    if (summary.keyPoints.length > 0) {
      text += `Key Points:\n${summary.keyPoints.map((p) => `- ${p}`).join('\n')}\n\n`;
    }

    if (summary.actionItems.length > 0) {
      text += `Action Items:\n${summary.actionItems.map((a) => `- ${a}`).join('\n')}\n\n`;
    }

    if (summary.decisions.length > 0) {
      text += `Decisions:\n${summary.decisions.map((d) => `- ${d}`).join('\n')}\n\n`;
    }

    if (summary.nextSteps && summary.nextSteps.length > 0) {
      text += `Next Steps:\n${summary.nextSteps.map((s) => `- ${s}`).join('\n')}`;
    }

    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatSummaryAsText(summary));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  return (
    <div className={`bg-secondary/20 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">AI Summary</h3>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label="Copy summary"
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
        {/* Overview */}
        {summary.overview && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Overview</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {summary.overview}
            </p>
          </div>
        )}

        {/* Key Points */}
        {summary.keyPoints.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Key Points</h4>
            <ul className="space-y-1 list-disc list-inside">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Items */}
        {summary.actionItems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Action Items</h4>
            <ul className="space-y-1 list-disc list-inside">
              {summary.actionItems.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Decisions */}
        {summary.decisions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Decisions</h4>
            <ul className="space-y-1 list-disc list-inside">
              {summary.decisions.map((decision, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {decision}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        {summary.nextSteps && summary.nextSteps.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Next Steps</h4>
            <ul className="space-y-1 list-disc list-inside">
              {summary.nextSteps.map((step, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
