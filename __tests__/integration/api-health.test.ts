/**
 * Integration tests for API health checks
 */

import { describe, it, expect } from 'vitest';

describe('API Health Checks', () => {
  it('should have Groq API key configured', () => {
    expect(process.env.GROQ_API_KEY).toBeDefined();
    expect(process.env.GROQ_API_KEY?.length).toBeGreaterThan(0);
  });

  it('should have Gemini API key configured', () => {
    expect(process.env.GEMINI_API_KEY).toBeDefined();
    expect(process.env.GEMINI_API_KEY?.length).toBeGreaterThan(0);
  });

  it('should have Supabase credentials configured', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL?.length).toBeGreaterThan(0);
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length).toBeGreaterThan(0);
  });

  it('should have valid Supabase URL format', () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url) {
      expect(url.startsWith('https://')).toBe(true);
      expect(url.includes('supabase.co')).toBe(true);
    }
  });
});
