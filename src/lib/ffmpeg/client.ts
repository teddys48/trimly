import type {
  MainToWorkerMessage,
  WorkerToMainMessage,
  FFmpegStatus,
  ProgressPayload,
  SuccessPayload,
  ErrorPayload,
  TrimRequestPayload
} from './types';

export class FFmpegClient {
  private worker: Worker | null = null;
  private onStatusCallback?: (status: FFmpegStatus, message?: string) => void;
  private onProgressCallback?: (progress: ProgressPayload) => void;
  private onSuccessCallback?: (result: SuccessPayload) => void;
  private onErrorCallback?: (error: ErrorPayload) => void;

  constructor() {}

  private initWorker() {
    if (this.worker) return;

    // Vite worker import url syntax
    this.worker = new Worker(new URL('./ffmpeg.worker.ts', import.meta.url), {
      type: 'module'
    });

    this.worker.onmessage = (event: MessageEvent<WorkerToMainMessage>) => {
      const msg = event.data;
      switch (msg.type) {
        case 'STATUS':
          this.onStatusCallback?.(msg.payload.status, msg.payload.message);
          break;
        case 'PROGRESS':
          this.onProgressCallback?.(msg.payload);
          break;
        case 'SUCCESS':
          this.onSuccessCallback?.(msg.payload);
          break;
        case 'ERROR':
          this.onErrorCallback?.(msg.payload);
          break;
      }
    };

    this.worker.onerror = (err) => {
      console.error('[FFmpeg Client Worker Error]', err);
      this.onErrorCallback?.({
        message: 'Web Worker error occurred.',
        detail: err.message
      });
    };
  }

  public setCallbacks(callbacks: {
    onStatus?: (status: FFmpegStatus, message?: string) => void;
    onProgress?: (progress: ProgressPayload) => void;
    onSuccess?: (result: SuccessPayload) => void;
    onError?: (error: ErrorPayload) => void;
  }) {
    this.onStatusCallback = callbacks.onStatus;
    this.onProgressCallback = callbacks.onProgress;
    this.onSuccessCallback = callbacks.onSuccess;
    this.onErrorCallback = callbacks.onError;
  }

  public load(): void {
    this.initWorker();
    this.worker?.postMessage({ type: 'LOAD' } as MainToWorkerMessage);
  }

  public trimVideo(file: File, startTime: number, endTime: number, mode: 'fast' | 'precise' = 'fast'): void {
    this.initWorker();
    const payload: TrimRequestPayload = { file, startTime, endTime, mode };
    this.worker?.postMessage({ type: 'TRIM', payload } as MainToWorkerMessage);
  }

  public cancel(): void {
    this.worker?.postMessage({ type: 'CANCEL' } as MainToWorkerMessage);
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
