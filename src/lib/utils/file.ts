/**
 * Generates an output filename appended with '-trimmed' before extension.
 * E.g., 'sample_video.mp4' -> 'sample_video-trimmed.mp4'
 */
export function generateOutputFilename(originalName: string, extFallback = 'mp4'): string {
  if (!originalName) return `trimmed-video.${extFallback}`;

  const lastDotIndex = originalName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${originalName}-trimmed.${extFallback}`;
  }

  const baseName = originalName.substring(0, lastDotIndex);
  const ext = originalName.substring(lastDotIndex + 1);

  return `${baseName}-trimmed.${ext || extFallback}`;
}

/**
 * Formats byte counts into human readable strings (KB, MB, GB).
 */
export function formatFileSize(bytes: number): string {
  if (isNaN(bytes) || bytes <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Safely revokes a URL object if present to prevent memory leaks.
 */
export function revokeObjectURL(url: string | null | undefined): void {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore invalid URL errors
    }
  }
}
