export type FFmpegStatus = 'idle' | 'loading' | 'ready' | 'processing' | 'done' | 'error';

export interface TrimRequestPayload {
  file: File;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  mode?: 'fast' | 'precise'; // fast = -c copy, precise = re-encode
}

export interface ProgressPayload {
  progress: number; // 0 to 100
  time?: number;    // seconds processed so far
  message?: string;
}

export interface SuccessPayload {
  blob: Blob;
  filename: string;
  size: number;
  duration: number;
}

export interface ErrorPayload {
  message: string;
  detail?: string;
}

// Main thread -> Worker messages
export type MainToWorkerMessage =
  | { type: 'LOAD' }
  | { type: 'TRIM'; payload: TrimRequestPayload }
  | { type: 'CANCEL' };

// Worker -> Main thread messages
export type WorkerToMainMessage =
  | { type: 'STATUS'; payload: { status: FFmpegStatus; message?: string } }
  | { type: 'PROGRESS'; payload: ProgressPayload }
  | { type: 'SUCCESS'; payload: SuccessPayload }
  | { type: 'ERROR'; payload: ErrorPayload };
