export const SUPPORTED_EXTENSIONS = ['mp4', 'webm', 'mov', 'mkv', 'avi'];
export const SUPPORTED_MIME_PREFIXES = ['video/'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates selected video file format and extension.
 */
export function validateVideoFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isExtensionValid = SUPPORTED_EXTENSIONS.includes(ext);
  const isMimeValid = file.type ? SUPPORTED_MIME_PREFIXES.some(prefix => file.type.startsWith(prefix)) : false;

  if (!isExtensionValid && !isMimeValid) {
    return {
      valid: false,
      error: `Unsupported file format ".${ext}". Please upload a valid MP4, WebM, MOV, or MKV video file.`
    };
  }

  // Max size warning (e.g. 2GB browser limit check)
  const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB
  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds 2 GB. Browser WebAssembly memory limits may prevent processing large videos.'
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty (0 bytes).' };
  }

  return { valid: true };
}

/**
 * Validates start and end range timestamps.
 */
export function validateTrimRange(
  startTime: number,
  endTime: number,
  duration: number,
  minDuration = 0.5
): ValidationResult {
  if (isNaN(startTime) || isNaN(endTime)) {
    return { valid: false, error: 'Invalid start or end timestamp.' };
  }

  if (startTime < 0) {
    return { valid: false, error: 'Start time cannot be negative.' };
  }

  if (endTime > duration && duration > 0) {
    return { valid: false, error: 'End time cannot exceed video duration.' };
  }

  if (startTime >= endTime) {
    return { valid: false, error: 'Start time must be strictly before end time.' };
  }

  if (endTime - startTime < minDuration) {
    return { valid: false, error: `Selected clip must be at least ${minDuration} seconds long.` };
  }

  return { valid: true };
}
