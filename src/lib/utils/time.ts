/**
 * Formats a duration in seconds into a human-readable timestamp (e.g., 01:23.45 or 01:02:03.45)
 */
export function formatTime(seconds: number, includeMillis: boolean = true): string {
  if (isNaN(seconds) || seconds < 0) return includeMillis ? '00:00.00' : '00:00';

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 100);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');

  const millisStr = includeMillis ? `.${pad(millis, 2)}` : '';

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}${millisStr}`;
  }
  return `${pad(mins)}:${pad(secs)}${millisStr}`;
}

/**
 * Parses a timestamp string (e.g. "01:23.45", "83.45", "01:02:03") into seconds.
 * Returns null if invalid.
 */
export function parseTime(timeStr: string): number | null {
  if (!timeStr || typeof timeStr !== 'string') return null;

  const trimmed = timeStr.trim();
  if (trimmed === '') return null;

  // Pure numeric input like "12.5"
  if (!trimmed.includes(':')) {
    const val = Number(trimmed);
    return isNaN(val) || val < 0 ? null : val;
  }

  const parts = trimmed.split(':');
  if (parts.length > 3) return null;

  let hrs = 0;
  let mins = 0;
  let secs = 0;

  if (parts.length === 3) {
    hrs = Number(parts[0]);
    mins = Number(parts[1]);
    secs = Number(parts[2]);
  } else if (parts.length === 2) {
    mins = Number(parts[0]);
    secs = Number(parts[1]);
  }

  if (isNaN(hrs) || isNaN(mins) || isNaN(secs)) return null;
  if (hrs < 0 || mins < 0 || mins >= 60 || secs < 0 || secs >= 60) return null;

  return hrs * 3600 + mins * 60 + secs;
}

/**
 * Clamps a number between a minimum and maximum value.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
