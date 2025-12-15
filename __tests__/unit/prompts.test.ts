/**
 * Unit tests for prompt templates
 */

import { describe, it, expect } from 'vitest';
import {
  SUMMARY_TEMPLATES,
  getSummaryPrompt,
  TEMPLATE_DISPLAY_NAMES,
  TEMPLATE_DESCRIPTIONS,
} from '@/lib/prompts';

describe('Prompt Templates', () => {
  describe('SUMMARY_TEMPLATES', () => {
    it('should have all required template types', () => {
      expect(SUMMARY_TEMPLATES).toHaveProperty('meeting');
      expect(SUMMARY_TEMPLATES).toHaveProperty('interview');
      expect(SUMMARY_TEMPLATES).toHaveProperty('lecture');
      expect(SUMMARY_TEMPLATES).toHaveProperty('memo');
    });

    it('should have non-empty template strings', () => {
      Object.values(SUMMARY_TEMPLATES).forEach((template) => {
        expect(template.length).toBeGreaterThan(0);
        expect(template).toContain('{transcript}');
      });
    });
  });

  describe('getSummaryPrompt', () => {
    it('should replace {transcript} placeholder', () => {
      const transcript = 'This is a test transcript';
      const prompt = getSummaryPrompt('meeting', transcript);

      expect(prompt).toContain(transcript);
      expect(prompt).not.toContain('{transcript}');
    });

    it('should work for all template types', () => {
      const transcript = 'Test';
      const templates: Array<keyof typeof SUMMARY_TEMPLATES> = [
        'meeting',
        'interview',
        'lecture',
        'memo',
      ];

      templates.forEach((template) => {
        const prompt = getSummaryPrompt(template, transcript);
        expect(prompt).toContain(transcript);
      });
    });
  });

  describe('TEMPLATE_DISPLAY_NAMES', () => {
    it('should have display names for all templates', () => {
      expect(TEMPLATE_DISPLAY_NAMES).toHaveProperty('meeting');
      expect(TEMPLATE_DISPLAY_NAMES).toHaveProperty('interview');
      expect(TEMPLATE_DISPLAY_NAMES).toHaveProperty('lecture');
      expect(TEMPLATE_DISPLAY_NAMES).toHaveProperty('memo');
    });
  });

  describe('TEMPLATE_DESCRIPTIONS', () => {
    it('should have descriptions for all templates', () => {
      expect(TEMPLATE_DESCRIPTIONS).toHaveProperty('meeting');
      expect(TEMPLATE_DESCRIPTIONS).toHaveProperty('interview');
      expect(TEMPLATE_DESCRIPTIONS).toHaveProperty('lecture');
      expect(TEMPLATE_DESCRIPTIONS).toHaveProperty('memo');
    });
  });
});
