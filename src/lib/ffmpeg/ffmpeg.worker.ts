import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { MainToWorkerMessage, WorkerToMainMessage, TrimRequestPayload } from './types';

let ffmpeg: FFmpeg | null = null;
let isCancelled = false;
let currentLog: string[] = [];

function postStatus(status: 'idle' | 'loading' | 'ready' | 'processing' | 'done' | 'error', message?: string) {
  self.postMessage({ type: 'STATUS', payload: { status, message } } as WorkerToMainMessage);
}

function postProgress(progress: number, time?: number, message?: string) {
  self.postMessage({ type: 'PROGRESS', payload: { progress: Math.min(100, Math.max(0, progress)), time, message } } as WorkerToMainMessage);
}

function postError(message: string, detail?: string) {
  self.postMessage({ type: 'ERROR', payload: { message, detail } } as WorkerToMainMessage);
}

async function getFFmpegInstance(): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) {
    return ffmpeg;
  }

  postStatus('loading', 'Loading FFmpeg WebAssembly core...');
  const instance = new FFmpeg();

  instance.on('log', ({ message }) => {
    currentLog.push(message);
    // Keep log buffer reasonable
    if (currentLog.length > 200) currentLog.shift();
  });

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

  try {
    const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
    const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');

    await instance.load({
      coreURL,
      wasmURL,
    });

    ffmpeg = instance;
    postStatus('ready', 'FFmpeg ready');
    return ffmpeg;
  } catch (err: any) {
    postStatus('error', 'Failed to load FFmpeg engine');
    throw new Error(`Failed to load FFmpeg core: ${err?.message || err}`);
  }
}

async function handleTrim(payload: TrimRequestPayload) {
  isCancelled = false;
  currentLog = [];
  const { file, startTime, endTime, mode = 'fast' } = payload;
  const clipDuration = endTime - startTime;

  try {
    postStatus('processing', 'Initializing video processing...');
    postProgress(5, 0, 'Loading WebAssembly engine...');

    const ff = await getFFmpegInstance();

    if (isCancelled) {
      postStatus('idle', 'Cancelled');
      return;
    }

    const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const inputName = `input_${Date.now()}.${inputExt}`;
    const outputName = `output_${Date.now()}.${inputExt}`;

    postProgress(15, 0, 'Writing file to memory...');
    const fileData = await fetchFile(file);
    await ff.writeFile(inputName, fileData);

    if (isCancelled) {
      await ff.deleteFile(inputName).catch(() => {});
      postStatus('idle', 'Cancelled');
      return;
    }

    postProgress(30, 0, 'Trimming video stream...');

    const progressHandler = ({ progress, time }: { progress: number; time: number }) => {
      if (isCancelled) return;
      // Convert time from microseconds to seconds if provided
      const processedSecs = time > 0 ? time / 1000000 : 0;
      let calculatedProgress = 30;

      if (clipDuration > 0 && processedSecs > 0) {
        calculatedProgress = 30 + Math.min(60, (processedSecs / clipDuration) * 60);
      } else if (progress > 0) {
        calculatedProgress = 30 + Math.min(60, progress * 60);
      }

      postProgress(Math.round(calculatedProgress), processedSecs, 'Processing video...');
    };

    ff.on('progress', progressHandler);

    // Build FFmpeg command arguments
    // Fast trim uses stream copy (-c copy)
    const args: string[] = [];
    if (mode === 'fast') {
      args.push(
        '-ss', startTime.toFixed(3),
        '-to', endTime.toFixed(3),
        '-i', inputName,
        '-c', 'copy',
        '-map', '0',
        '-avoid_negative_ts', 'make_zero',
        outputName
      );
    } else {
      // Precise mode fallback re-encoding
      args.push(
        '-ss', startTime.toFixed(3),
        '-to', endTime.toFixed(3),
        '-i', inputName,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        outputName
      );
    }

    const exitCode = await ff.exec(args);

    ff.off('progress', progressHandler);

    if (isCancelled) {
      await ff.deleteFile(inputName).catch(() => {});
      await ff.deleteFile(outputName).catch(() => {});
      postStatus('idle', 'Cancelled');
      return;
    }

    if (exitCode !== 0) {
      const logDetail = currentLog.slice(-15).join('\n');
      throw new Error(`FFmpeg exited with non-zero status code ${exitCode}.\nLog excerpt:\n${logDetail}`);
    }

    postProgress(90, clipDuration, 'Reading output file...');
    const data = await ff.readFile(outputName);

    // Clean up virtual filesystem immediately to prevent memory leak
    await ff.deleteFile(inputName).catch(() => {});
    await ff.deleteFile(outputName).catch(() => {});

    // Create Blob output
    const mimeType = file.type || `video/${inputExt === 'mov' ? 'mp4' : inputExt}`;
    const blob = new Blob([data as Uint8Array], { type: mimeType });

    postProgress(100, clipDuration, 'Complete!');
    postStatus('done', 'Trim completed successfully');

    self.postMessage({
      type: 'SUCCESS',
      payload: {
        blob,
        filename: file.name,
        size: blob.size,
        duration: clipDuration
      }
    } as WorkerToMainMessage);

  } catch (err: any) {
    postStatus('error', 'Error processing video');
    postError(
      err?.message || 'Failed to trim video.',
      currentLog.length > 0 ? currentLog.slice(-20).join('\n') : undefined
    );
  }
}

self.onmessage = (e: MessageEvent<MainToWorkerMessage>) => {
  const message = e.data;
  switch (message.type) {
    case 'LOAD':
      getFFmpegInstance().catch((err) => {
        postError('Could not initialize FFmpeg WebAssembly.', err.message);
      });
      break;
    case 'TRIM':
      handleTrim(message.payload);
      break;
    case 'CANCEL':
      isCancelled = true;
      break;
  }
};
