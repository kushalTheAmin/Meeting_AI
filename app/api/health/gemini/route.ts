/**
 * Health check endpoint for Gemini API
 */

import { NextResponse } from 'next/server';
import { testGeminiConnection } from '@/lib/gemini';
import type { HealthCheckResponse } from '@/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const isHealthy = await testGeminiConnection();

    const response: HealthCheckResponse = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      message: isHealthy
        ? 'Gemini API connection successful'
        : 'Gemini API connection failed',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: isHealthy ? 200 : 503,
    });
  } catch (error) {
    const response: HealthCheckResponse = {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 503 });
  }
}
