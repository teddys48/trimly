<script lang="ts">
  import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-svelte';
  import { formatTime } from '../utils/time';

  let {
    src,
    currentTime = $bindable(0),
    duration = $bindable(0),
    isPlaying = $bindable(false),
    startTime = 0,
    endTime = 0
  }: {
    src: string;
    currentTime?: number;
    duration?: number;
    isPlaying?: boolean;
    startTime?: number;
    endTime?: number;
  } = $props();

  let videoRef: HTMLVideoElement | null = $state(null);
  let isMuted = $state(false);

  // Synchronize external play/pause requests
  $effect(() => {
    if (!videoRef) return;
    if (isPlaying && videoRef.paused) {
      videoRef.play().catch(() => {
        isPlaying = false;
      });
    } else if (!isPlaying && !videoRef.paused) {
      videoRef.pause();
    }
  });

  // Range constraint checking during playback
  function onTimeUpdate() {
    if (!videoRef) return;
    currentTime = videoRef.currentTime;

    // If previewing within range and playback reaches or exceeds end time
    if (endTime > startTime && isPlaying) {
      if (videoRef.currentTime >= endTime) {
        videoRef.currentTime = startTime;
      }
    }
  }

  function onLoadedMetadata() {
    if (!videoRef) return;
    duration = videoRef.duration || 0;
    if (currentTime > duration) {
      currentTime = 0;
    }
  }

  function togglePlay() {
    if (!videoRef) return;
    if (isPlaying) {
      videoRef.pause();
      isPlaying = false;
    } else {
      // If current time is outside range or near end, reset to start
      if (currentTime >= endTime && endTime > startTime) {
        videoRef.currentTime = startTime;
      }
      videoRef.play().then(() => {
        isPlaying = true;
      }).catch(() => {
        isPlaying = false;
      });
    }
  }

  function toggleMute() {
    if (!videoRef) return;
    isMuted = !isMuted;
    videoRef.muted = isMuted;
  }

  function toggleFullscreen() {
    if (!videoRef) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.requestFullscreen().catch(() => {});
    }
  }

  // Seek video when currentTime is set externally by timeline slider
  $effect(() => {
    if (videoRef && Math.abs(videoRef.currentTime - currentTime) > 0.15) {
      videoRef.currentTime = currentTime;
    }
  });
</script>

<div class="relative w-full rounded-2xl bg-black overflow-hidden shadow-2xl border border-slate-800 group">
  <!-- Native Video Element -->
  <video
    bind:this={videoRef}
    {src}
    ontimeupdate={onTimeUpdate}
    onloadedmetadata={onLoadedMetadata}
    onplay={() => (isPlaying = true)}
    onpause={() => (isPlaying = false)}
    onended={() => (isPlaying = false)}
    class="w-full h-auto max-h-[55vh] object-contain mx-auto select-none"
    playsinline
  >
    <track kind="captions" />
  </video>

  <!-- Overlay Video Play / Pause button on hover/click -->
  <div
    role="button"
    tabindex="0"
    onclick={togglePlay}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && togglePlay()}
    class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
  >
    <div class="p-4 rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-white/10 shadow-xl transform scale-90 group-hover:scale-100 transition-all">
      {#if isPlaying}
        <Pause class="w-8 h-8" />
      {:else}
        <Play class="w-8 h-8 translate-x-0.5" />
      {/if}
    </div>
  </div>

  <!-- Bottom Control Overlay -->
  <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
    <div class="flex items-center gap-3">
      <button
        onclick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        class="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/50 backdrop-blur-sm transition-colors"
      >
        {#if isPlaying}
          <Pause class="w-4 h-4" />
        {:else}
          <Play class="w-4 h-4" />
        {/if}
      </button>

      <div class="text-xs font-mono font-medium text-slate-200 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-sm">
        <span>{formatTime(currentTime)}</span>
        <span class="text-slate-500 mx-1">/</span>
        <span class="text-slate-400">{formatTime(duration)}</span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button
        onclick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        class="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/50 backdrop-blur-sm transition-colors"
      >
        {#if isMuted}
          <VolumeX class="w-4 h-4 text-rose-400" />
        {:else}
          <Volume2 class="w-4 h-4" />
        {/if}
      </button>

      <button
        onclick={toggleFullscreen}
        aria-label="Toggle Fullscreen"
        class="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/50 backdrop-blur-sm transition-colors hidden sm:flex"
      >
        <Maximize class="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
