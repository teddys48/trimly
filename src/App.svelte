<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Header from './lib/components/Header.svelte';
  import PrivacyBadge from './lib/components/PrivacyBadge.svelte';
  import VideoUploader from './lib/components/VideoUploader.svelte';
  import VideoPreview from './lib/components/VideoPreview.svelte';
  import Timeline from './lib/components/Timeline.svelte';
  import TimeInput from './lib/components/TimeInput.svelte';
  import TrimControls from './lib/components/TrimControls.svelte';
  import ProcessingProgress from './lib/components/ProcessingProgress.svelte';
  import DownloadResult from './lib/components/DownloadResult.svelte';
  import ErrorMessage from './lib/components/ErrorMessage.svelte';

  import { FFmpegClient } from './lib/ffmpeg/client';
  import { generateOutputFilename, revokeObjectURL } from './lib/utils/file';
  import { validateTrimRange } from './lib/utils/validation';

  // App State
  let isDark = $state(true);
  let file = $state<File | null>(null);
  let objectUrl = $state<string | null>(null);
  let duration = $state<number>(0);
  let currentTime = $state<number>(0);
  let startTime = $state<number>(0);
  let endTime = $state<number>(0);
  let isPlaying = $state<boolean>(false);

  // FFmpeg Processing State
  let isProcessing = $state<boolean>(false);
  let progress = $state<number>(0);
  let statusMessage = $state<string>('');
  let outputUrl = $state<string | null>(null);
  let outputFilename = $state<string>('');
  let outputSize = $state<number>(0);
  let outputDuration = $state<number>(0);

  // Error State
  let errorMessage = $state<string | null>(null);
  let errorDetail = $state<string | undefined>(undefined);

  // FFmpeg Web Worker Singleton Client
  const ffmpegClient = new FFmpegClient();

  onMount(() => {
    ffmpegClient.setCallbacks({
      onStatus: (status, msg) => {
        if (msg) statusMessage = msg;
        if (status === 'processing' || status === 'loading') {
          isProcessing = true;
        } else if (status === 'done' || status === 'idle' || status === 'error') {
          isProcessing = false;
        }
      },
      onProgress: (p) => {
        progress = p.progress;
        if (p.message) statusMessage = p.message;
      },
      onSuccess: (res) => {
        isProcessing = false;
        errorMessage = null;
        errorDetail = undefined;

        revokeObjectURL(outputUrl);
        outputUrl = URL.createObjectURL(res.blob);
        outputFilename = generateOutputFilename(res.filename);
        outputSize = res.size;
        outputDuration = res.duration;
      },
      onError: (err) => {
        isProcessing = false;
        errorMessage = err.message || 'An error occurred while trimming the video.';
        errorDetail = err.detail;
      }
    });
  });

  onDestroy(() => {
    revokeObjectURL(objectUrl);
    revokeObjectURL(outputUrl);
    ffmpegClient.terminate();
  });

  function handleFileSelect(selectedFile: File) {
    // Reset previous media object URLs
    revokeObjectURL(objectUrl);
    revokeObjectURL(outputUrl);
    outputUrl = null;
    errorMessage = null;
    errorDetail = undefined;

    file = selectedFile;
    objectUrl = URL.createObjectURL(selectedFile);
    currentTime = 0;
    startTime = 0;
    endTime = 0;
    duration = 0;
    isPlaying = false;
  }

  // When video duration loads, set default end time
  $effect(() => {
    if (duration > 0 && (endTime === 0 || endTime > duration)) {
      endTime = duration;
    }
  });

  function handlePreviewRange() {
    currentTime = startTime;
    isPlaying = true;
  }

  function handleTrim() {
    if (!file) return;

    const validation = validateTrimRange(startTime, endTime, duration);
    if (!validation.valid) {
      errorMessage = validation.error || 'Invalid trim range selected.';
      return;
    }

    errorMessage = null;
    errorDetail = undefined;
    isProcessing = true;
    progress = 5;
    statusMessage = 'Starting trim worker...';

    ffmpegClient.trimVideo(file, startTime, endTime, 'fast');
  }

  function handleCancel() {
    ffmpegClient.cancel();
    isProcessing = false;
    statusMessage = 'Cancelled';
  }

  function handleReset() {
    revokeObjectURL(objectUrl);
    revokeObjectURL(outputUrl);
    file = null;
    objectUrl = null;
    outputUrl = null;
    duration = 0;
    currentTime = 0;
    startTime = 0;
    endTime = 0;
    isPlaying = false;
    isProcessing = false;
    errorMessage = null;
    errorDetail = undefined;
  }
</script>

<div class="min-h-screen flex flex-col transition-colors duration-200">
  <Header bind:isDark />

  <main class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
    <!-- Privacy Banner -->
    <PrivacyBadge />

    {#if !file}
      <!-- Upload View -->
      <section class="py-6 sm:py-12 animate-fade-in">
        <VideoUploader onFileSelect={handleFileSelect} />
      </section>
    {:else if outputUrl}
      <!-- Success Output Result View -->
      <section>
        <DownloadResult
          {outputUrl}
          {outputFilename}
          {outputSize}
          clipDuration={outputDuration}
          originalSize={file.size}
          onReset={handleReset}
        />
      </section>
    {:else}
      <!-- Trimming Workflow View -->
      <div class="space-y-6 animate-fade-in">
        {#if errorMessage}
          <ErrorMessage
            message={errorMessage}
            detail={errorDetail}
            onRetry={handleTrim}
          />
        {/if}

        {#if isProcessing}
          <ProcessingProgress
            {progress}
            {statusMessage}
            onCancel={handleCancel}
          />
        {:else}
          <!-- Video Preview Box -->
          {#if objectUrl}
            <VideoPreview
              src={objectUrl}
              bind:currentTime
              bind:duration
              bind:isPlaying
              {startTime}
              {endTime}
            />
          {/if}

          <!-- Timeline Slider Control -->
          {#if duration > 0}
            <div class="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm space-y-6 shadow-xl transition-colors">
              <Timeline
                {duration}
                bind:currentTime
                bind:startTime
                bind:endTime
              />

              <TimeInput
                bind:startTime
                bind:endTime
                {duration}
              />

              <TrimControls
                onPreviewRange={handlePreviewRange}
                onTrim={handleTrim}
                onChangeVideo={handleReset}
                {isProcessing}
              />
            </div>
          {/if}
        {/if}
      </div>
    {/if}
  </main>

  <footer class="border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
    <p>Trimly — 100% Client-Side Video Trimmer powered by Svelte 5 & FFmpeg WebAssembly.</p>
  </footer>
</div>
