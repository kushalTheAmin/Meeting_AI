/**
 * Health check endpoint for Groq API
 */

import { NextResponse } from 'next/server';
import { testGroqConnection } from '@/lib/groq';
import type { HealthCheckResponse } from '@/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const isHealthy = await testGroqConnection();

    const response: HealthCheckResponse = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      message: isHealthy
        ? 'Groq API connection successful'
        : 'Groq API connection failed',
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
