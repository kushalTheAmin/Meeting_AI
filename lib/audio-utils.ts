/**
 * Audio processing utilities
 */

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Validate audio file size and type
 */
export function validateAudioFile(file: File, maxSize: number = 25 * 1024 * 1024): boolean {
  // Check file size (max 25MB)
  if (file.size > maxSize) {
    return false;
  }

  // Check file type
  const validTypes = ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
  if (!validTypes.includes(file.type)) {
    return false;
  }

  return true;
}

/**
 * Convert blob to base64 string
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove data URL prefix (e.g., "data:audio/webm;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Get audio duration from blob
 */
export async function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = () => {
      reject(new Error('Failed to load audio metadata'));
    };
    audio.src = URL.createObjectURL(blob);
  });
}

/**
 * Get MIME type for audio format
 */
export function getAudioMimeType(format: string = 'webm'): string {
  const mimeTypes: Record<string, string> = {
    webm: 'audio/webm;codecs=opus',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg;codecs=opus',
  };

  return mimeTypes[format] || mimeTypes.webm;
}

/**
 * Check if browser supports audio recording
 */
export function checkAudioSupport(): {
  supported: boolean;
  error?: string;
} {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      supported: false,
      error: 'Your browser does not support audio recording',
    };
  }

  if (!window.MediaRecorder) {
    return {
      supported: false,
      error: 'MediaRecorder API is not supported in your browser',
    };
  }

  return { supported: true };
}

/**
 * Request microphone permission
 */
export async function requestMicrophonePermission(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No microphone found. Please connect a microphone and try again.');
      }
      throw new Error(`Microphone access error: ${error.message}`);
    }
    throw new Error('Failed to access microphone');
  }
}

/**
 * Generate a unique filename for recordings
 */
export function generateRecordingFilename(prefix: string = 'recording'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}_${timestamp}.webm`;
}

/**
 * Download audio file
 */
export function downloadAudioFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Convert audio format (placeholder for future implementation)
 */
export async function convertAudioFormat(
  blob: Blob,
  _targetFormat: string
): Promise<Blob> {
  // For now, just return the original blob
  // In the future, this could use a library like ffmpeg.wasm
  return blob;
}

/**
 * Upload audio file to Supabase storage
 * This is a wrapper that should be called from the client side
 */
export async function uploadAudioFile(
  file: Blob,
  filename: string
): Promise<string> {
  // This function is imported from lib/supabase.ts but re-exported here
  // for convenience in the hooks
  const { uploadAudioFile: supabaseUpload } = await import('./supabase');
  return supabaseUpload(file, filename);
}
