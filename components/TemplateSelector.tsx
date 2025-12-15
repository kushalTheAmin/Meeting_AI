/**
 * Summary template selector component
 */

'use client';

import React from 'react';
import type { SummaryTemplate } from '@/types';
import { TEMPLATE_DISPLAY_NAMES, TEMPLATE_DESCRIPTIONS } from '@/lib/prompts';

interface TemplateSelectorProps {
  selected: SummaryTemplate;
  onChange: (template: SummaryTemplate) => void;
  className?: string;
}

export function TemplateSelector({
  selected,
  onChange,
  className = '',
}: TemplateSelectorProps) {
  const templates: SummaryTemplate[] = ['meeting', 'interview', 'lecture', 'memo'];

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-foreground">
        Summary Template
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((template) => (
          <button
            key={template}
            onClick={() => onChange(template)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selected === template
                ? 'border-primary bg-primary/10'
                : 'border-border bg-background hover:border-primary/50'
            }`}
            aria-pressed={selected === template}
          >
            <div className="font-medium text-sm mb-1">
              {TEMPLATE_DISPLAY_NAMES[template]}
            </div>
            <div className="text-xs text-muted-foreground">
              {TEMPLATE_DESCRIPTIONS[template]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
