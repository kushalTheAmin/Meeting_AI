/**
 * Supabase client configuration and utilities
 */

import { createClient } from '@supabase/supabase-js';
import type { Recording } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Supabase client instance
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload audio file to Supabase storage
 */
export async function uploadAudioFile(
  file: Blob,
  filename: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('recordings')
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload audio file: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('recordings')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete audio file from Supabase storage
 */
export async function deleteAudioFile(url: string): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from('recordings')
      .remove([filename]);

    if (error) {
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete audio file: ${error.message}`);
    }
    throw new Error('Failed to delete audio file');
  }
}

/**
 * Save recording to database
 */
export async function saveRecording(
  recording: Omit<Recording, 'id' | 'created_at'>
): Promise<Recording> {
  const { data, error } = await supabase
    .from('recordings')
    .insert([recording])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save recording: ${error.message}`);
  }

  return data;
}

/**
 * Get all recordings
 */
export async function getRecordings(
  limit: number = 50,
  offset: number = 0
): Promise<Recording[]> {
  const { data, error } = await supabase
    .from('recordings')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch recordings: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single recording by ID
 */
export async function getRecording(id: string): Promise<Recording | null> {
  const { data, error } = await supabase
    .from('recordings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch recording: ${error.message}`);
  }

  return data;
}

/**
 * Update recording
 */
export async function updateRecording(
  id: string,
  updates: Partial<Omit<Recording, 'id' | 'created_at'>>
): Promise<Recording> {
  const { data, error } = await supabase
    .from('recordings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update recording: ${error.message}`);
  }

  return data;
}

/**
 * Delete recording
 */
export async function deleteRecording(id: string): Promise<void> {
  // First get the recording to get the audio URL
  const recording = await getRecording(id);

  if (recording && recording.audio_url) {
    // Delete the audio file from storage
    await deleteAudioFile(recording.audio_url);
  }

  // Delete the database record
  const { error } = await supabase
    .from('recordings')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete recording: ${error.message}`);
  }
}

/**
 * Search recordings by transcript content
 */
export async function searchRecordings(
  query: string,
  limit: number = 50
): Promise<Recording[]> {
  const { data, error } = await supabase
    .from('recordings')
    .select('*')
    .or(`transcript.ilike.%${query}%,title.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to search recordings: ${error.message}`);
  }

  return data || [];
}

/**
 * Test Supabase connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('recordings')
      .select('count')
      .limit(1);

    return !error;
  } catch {
    return false;
  }
}
