/**
 * Unit tests for audio utilities
 */

import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  validateAudioFile,
  getAudioMimeType,
  checkAudioSupport,
} from '@/lib/audio-utils';

describe('Audio Utils', () => {
  describe('formatDuration', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatDuration(0)).toBe('00:00');
      expect(formatDuration(30)).toBe('00:30');
      expect(formatDuration(65)).toBe('01:05');
      expect(formatDuration(3661)).toBe('61:01');
      expect(formatDuration(600)).toBe('10:00');
    });

    it('should handle decimal seconds', () => {
      expect(formatDuration(65.7)).toBe('01:05');
      expect(formatDuration(120.3)).toBe('02:00');
    });
  });

  describe('validateAudioFile', () => {
    it('should validate audio file size', () => {
      const smallFile = new File(['test'], 'test.webm', { type: 'audio/webm' });
      expect(validateAudioFile(smallFile, 10 * 1024 * 1024)).toBe(true);
    });

    it('should reject files that are too large', () => {
      const largeContent = new Array(26 * 1024 * 1024).fill('a').join('');
      const largeFile = new File([largeContent], 'test.webm', { type: 'audio/webm' });
      expect(validateAudioFile(largeFile, 25 * 1024 * 1024)).toBe(false);
    });

    it('should validate audio file types', () => {
      const validTypes = ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav'];

      validTypes.forEach((type) => {
        const file = new File(['test'], 'test.audio', { type });
        expect(validateAudioFile(file)).toBe(true);
      });
    });

    it('should reject invalid file types', () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      expect(validateAudioFile(invalidFile)).toBe(false);
    });
  });

  describe('getAudioMimeType', () => {
    it('should return correct MIME types', () => {
      expect(getAudioMimeType('webm')).toBe('audio/webm;codecs=opus');
      expect(getAudioMimeType('mp3')).toBe('audio/mpeg');
      expect(getAudioMimeType('wav')).toBe('audio/wav');
      expect(getAudioMimeType('ogg')).toBe('audio/ogg;codecs=opus');
    });

    it('should default to webm for unknown formats', () => {
      expect(getAudioMimeType('unknown')).toBe('audio/webm;codecs=opus');
    });
  });

  describe('checkAudioSupport', () => {
    it('should check for audio support', () => {
      const result = checkAudioSupport();
      expect(result).toHaveProperty('supported');
      expect(typeof result.supported).toBe('boolean');

      if (!result.supported) {
        expect(result).toHaveProperty('error');
        expect(typeof result.error).toBe('string');
      }
    });
  });
});
