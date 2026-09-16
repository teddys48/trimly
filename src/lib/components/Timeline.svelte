<script lang="ts">
  import { formatTime, clamp } from '../utils/time';

  let {
    duration = 0,
    currentTime = $bindable(0),
    startTime = $bindable(0),
    endTime = $bindable(0),
    minDuration = 0.5,
    onSeek
  }: {
    duration: number;
    currentTime: number;
    startTime: number;
    endTime: number;
    minDuration?: number;
    onSeek?: (time: number) => void;
  } = $props();

  let trackRef: HTMLDivElement | null = $state(null);
  let activeHandle = $state<'start' | 'end' | null>(null);

  // Derived percentages
  let startPercent = $derived(duration > 0 ? (startTime / duration) * 100 : 0);
  let endPercent = $derived(duration > 0 ? (endTime / duration) * 100 : 100);
  let currentPercent = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);

  function getTimeFromClientX(clientX: number): number {
    if (!trackRef || duration <= 0) return 0;
    const rect = trackRef.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * duration;
  }

  function handleTrackClick(e: MouseEvent | TouchEvent) {
    if (activeHandle) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newTime = getTimeFromClientX(clientX);
    currentTime = clamp(newTime, 0, duration);
    onSeek?.(currentTime);
  }

  function startDragging(handle: 'start' | 'end', e: MouseEvent | TouchEvent) {
    e.stopPropagation();
    activeHandle = handle;

    function onPointerMove(moveEvent: MouseEvent | TouchEvent) {
      if (!activeHandle) return;
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const time = getTimeFromClientX(clientX);

      if (activeHandle === 'start') {
        const maxStart = Math.max(0, endTime - minDuration);
        startTime = clamp(time, 0, maxStart);
        if (currentTime < startTime) {
          currentTime = startTime;
        }
      } else if (activeHandle === 'end') {
        const minEnd = Math.min(duration, startTime + minDuration);
        endTime = clamp(time, minEnd, duration);
        if (currentTime > endTime) {
          currentTime = endTime;
        }
      }
    }

    function stopDragging() {
      activeHandle = null;
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', stopDragging);
    }

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', stopDragging);
  }

  // Keyboard accessibility adjustments
  function handleKeyDown(handle: 'start' | 'end', e: KeyboardEvent) {
    const step = e.shiftKey ? 1.0 : 0.1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (handle === 'start') {
        startTime = clamp(startTime - step, 0, endTime - minDuration);
      } else {
        endTime = clamp(endTime - step, startTime + minDuration, duration);
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (handle === 'start') {
        startTime = clamp(startTime + step, 0, endTime - minDuration);
      } else {
        endTime = clamp(endTime + step, startTime + minDuration, duration);
      }
    }
  }
</script>

<div class="w-full space-y-3 select-none">
  <!-- Top Timestamps Header -->
  <div class="flex items-center justify-between text-xs font-mono font-medium text-slate-600 dark:text-slate-400 px-1">
    <div class="flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      <span>Start: <strong class="text-emerald-600 dark:text-emerald-400">{formatTime(startTime)}</strong></span>
    </div>

    <div>
      Selected: <strong class="text-indigo-600 dark:text-indigo-300 font-semibold">{formatTime(Math.max(0, endTime - startTime))}</strong>
    </div>

    <div class="flex items-center gap-1.5">
      <span>End: <strong class="text-purple-600 dark:text-purple-400">{formatTime(endTime)}</strong></span>
      <span class="w-2 h-2 rounded-full bg-purple-500"></span>
    </div>
  </div>

  <!-- Interactive Track Container -->
  <div
    bind:this={trackRef}
    onclick={handleTrackClick}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleTrackClick(e)}
    role="slider"
    aria-label="Timeline seek track"
    aria-valuemin={0}
    aria-valuemax={duration}
    aria-valuenow={currentTime}
    tabindex="0"
    class="relative w-full h-14 bg-slate-200 dark:bg-slate-900/90 rounded-2xl border border-slate-300 dark:border-slate-800 p-1 flex items-center cursor-pointer shadow-inner overflow-visible transition-colors"
  >
    <!-- Background track ticks / grid pattern -->
    <div class="absolute inset-x-2 inset-y-2 rounded-xl bg-slate-100 dark:bg-slate-950/60 overflow-hidden">
      <div class="w-full h-full bg-[linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:12px_100%]"></div>
    </div>

    <!-- Trimmed Region Highlight -->
    <div
      class="absolute top-2 bottom-2 bg-indigo-500/20 dark:bg-gradient-to-r dark:from-emerald-500/20 dark:via-indigo-500/30 dark:to-purple-500/20 border-t-2 border-b-2 border-indigo-500 rounded-sm pointer-events-none transition-all duration-75"
      style="left: {startPercent}%; width: {endPercent - startPercent}%;"
    ></div>

    <!-- Playhead Current Position Line -->
    <div
      class="absolute top-0 bottom-0 w-0.5 bg-indigo-600 dark:bg-white shadow-[0_0_8px_rgba(99,102,241,0.8)] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)] z-20 pointer-events-none transition-all duration-75"
      style="left: {currentPercent}%;"
    >
      <div class="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-white -translate-x-[4px] -translate-y-[2px] shadow-md"></div>
    </div>

    <!-- Left Handle (Start Time) -->
    <div
      role="slider"
      aria-label="Start time handle"
      aria-valuemin={0}
      aria-valuemax={endTime - minDuration}
      aria-valuenow={startTime}
      tabindex="0"
      onmousedown={(e) => startDragging('start', e)}
      ontouchstart={(e) => startDragging('start', e)}
      onkeydown={(e) => handleKeyDown('start', e)}
      class="absolute top-1 bottom-1 w-6 -ml-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-300 rounded-l-xl rounded-r-md cursor-ew-resize flex items-center justify-center z-30 shadow-lg shadow-emerald-500/30 border border-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
      style="left: {startPercent}%;"
    >
      <div class="flex flex-col gap-1 pointer-events-none">
        <div class="w-1 h-3 bg-emerald-950/60 rounded-full"></div>
      </div>
    </div>

    <!-- Right Handle (End Time) -->
    <div
      role="slider"
      aria-label="End time handle"
      aria-valuemin={startTime + minDuration}
      aria-valuemax={duration}
      aria-valuenow={endTime}
      tabindex="0"
      onmousedown={(e) => startDragging('end', e)}
      ontouchstart={(e) => startDragging('end', e)}
      onkeydown={(e) => handleKeyDown('end', e)}
      class="absolute top-1 bottom-1 w-6 -ml-3 bg-purple-500 hover:bg-purple-400 active:bg-purple-300 rounded-r-xl rounded-l-md cursor-ew-resize flex items-center justify-center z-30 shadow-lg shadow-purple-500/30 border border-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
      style="left: {endPercent}%;"
    >
      <div class="flex flex-col gap-1 pointer-events-none">
        <div class="w-1 h-3 bg-purple-950/60 rounded-full"></div>
      </div>
    </div>
  </div>
</div>
