/**
 * API route for recordings CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getRecordings,
  saveRecording,
  deleteRecording,
  updateRecording,
  searchRecordings,
} from '@/lib/supabase';
import type { Recording, APIError } from '@/types';

export const runtime = 'nodejs';

/**
 * GET /api/recordings - Fetch recordings (with optional search)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let recordings: Recording[];

    if (searchQuery) {
      recordings = await searchRecordings(searchQuery, limit);
    } else {
      recordings = await getRecordings(limit, offset);
    }

    return NextResponse.json(recordings);
  } catch (error) {
    console.error('Failed to fetch recordings:', error);

    if (error instanceof Error) {
      return NextResponse.json<APIError>(
        {
          error: 'Failed to fetch recordings',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<APIError>(
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recordings - Create new recording
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json<APIError>(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    const recording = await saveRecording({
      title: body.title,
      transcript: body.transcript || null,
      summary: body.summary || null,
      duration: body.duration || 0,
      audio_url: body.audio_url || null,
      template_used: body.template_used || 'memo',
      metadata: body.metadata || {},
    });

    return NextResponse.json(recording, { status: 201 });
  } catch (error) {
    console.error('Failed to save recording:', error);

    if (error instanceof Error) {
      return NextResponse.json<APIError>(
        {
          error: 'Failed to save recording',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<APIError>(
      { error: 'Failed to save recording' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/recordings - Update recording
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<APIError>(
        { error: 'Missing recording ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const recording = await updateRecording(id, body);

    return NextResponse.json(recording);
  } catch (error) {
    console.error('Failed to update recording:', error);

    if (error instanceof Error) {
      return NextResponse.json<APIError>(
        {
          error: 'Failed to update recording',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<APIError>(
      { error: 'Failed to update recording' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recordings - Delete recording
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<APIError>(
        { error: 'Missing recording ID' },
        { status: 400 }
      );
    }

    await deleteRecording(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete recording:', error);

    if (error instanceof Error) {
      return NextResponse.json<APIError>(
        {
          error: 'Failed to delete recording',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<APIError>(
      { error: 'Failed to delete recording' },
      { status: 500 }
    );
  }
}
