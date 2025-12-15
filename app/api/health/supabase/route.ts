/**
 * Health check endpoint for Supabase
 */

import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/supabase';
import type { HealthCheckResponse } from '@/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const isHealthy = await testConnection();

    const response: HealthCheckResponse = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      message: isHealthy
        ? 'Supabase connection successful'
        : 'Supabase connection failed',
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
