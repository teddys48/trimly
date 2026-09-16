<script lang="ts">
  import { formatTime, parseTime, clamp } from '../utils/time';
  import { Clock, Plus, Minus } from 'lucide-svelte';

  let {
    startTime = $bindable(0),
    endTime = $bindable(0),
    duration = 0,
    minDuration = 0.5
  }: {
    startTime: number;
    endTime: number;
    duration: number;
    minDuration?: number;
  } = $props();

  let startText = $state(formatTime(startTime));
  let endText = $state(formatTime(endTime));

  $effect(() => {
    startText = formatTime(startTime);
  });

  $effect(() => {
    endText = formatTime(endTime);
  });

  function applyStartChange(newVal: number) {
    const clamped = clamp(newVal, 0, Math.max(0, endTime - minDuration));
    startTime = clamped;
    startText = formatTime(clamped);
  }

  function applyEndChange(newVal: number) {
    const clamped = clamp(newVal, Math.min(duration, startTime + minDuration), duration);
    endTime = clamped;
    endText = formatTime(clamped);
  }

  function onStartBlur() {
    const parsed = parseTime(startText);
    if (parsed !== null) {
      applyStartChange(parsed);
    } else {
      startText = formatTime(startTime);
    }
  }

  function onEndBlur() {
    const parsed = parseTime(endText);
    if (parsed !== null) {
      applyEndChange(parsed);
    } else {
      endText = formatTime(endTime);
    }
  }

  function handleStartKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      onStartBlur();
    }
  }

  function handleEndKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      onEndBlur();
    }
  }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <!-- Start Time Control Box -->
  <div class="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2.5 shadow-sm transition-colors">
    <div class="flex items-center justify-between">
      <label for="start-time-input" class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
        <Clock class="w-3.5 h-3.5" /> Start Timestamp
      </label>
      <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">HH:MM:SS.ss</span>
    </div>

    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <input
          id="start-time-input"
          type="text"
          bind:value={startText}
          onblur={onStartBlur}
          onkeydown={handleStartKey}
          class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-center"
        />
      </div>

      <!-- Micro adjustment buttons -->
      <div class="flex items-center gap-1">
        <button
          onclick={() => applyStartChange(startTime - 1)}
          title="Decrease 1s"
          class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700/60 text-xs font-mono font-medium cursor-pointer"
        >-1s</button>
        <button
          onclick={() => applyStartChange(startTime - 0.1)}
          title="Decrease 0.1s"
          class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700/60 cursor-pointer"
        ><Minus class="w-3.5 h-3.5" /></button>
        <button
          onclick={() => applyStartChange(startTime + 0.1)}
          title="Increase 0.1s"
          class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700/60 cursor-pointer"
        ><Plus class="w-3.5 h-3.5" /></button>
        <button
          onclick={() => applyStartChange(startTime + 1)}
          title="Increase 1s"
          class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700/60 text-xs font-mono font-medium cursor-pointer"
        >+1s</button>
      </div>
    </div>
  </div>

  <!-- End Time Control Box -->
  <div class="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2.5 shadow-sm transition-colors">
    <div class="flex items-center justify-between">
      <label for="end-time-input" class="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
        <Clock class="w-3.5 h-3.5" /> End Timestamp
      </label>
      <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">HH:MM:SS.ss</span>
    </div>

    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <input
          id="end-time-input"
          type="text"
          bind:value={endText}
          onblur={onEndBlur}
          onkeydown={handleEndKey}
          class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-center"
        />
      </div>

      <!-- Micro adjustment buttons -->
      <div class="flex items-center gap-1">
        <button
          onclick={() => applyEndChange(endTime - 1)}
          title="Decrease 1s"
          class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700/60 text-xs font-mono font-medium cursor-pointer"
        >-1s</button>
        <button
          onclick={() => applyEndChange(endTime - 0.1)}
          title="Decrease 0.1s"
          class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700/60 cursor-pointer"
        ><Minus class="w-3.5 h-3.5" /></button>
        <button
          onclick={() => applyEndChange(endTime + 0.1)}
          title="Increase 0.1s"
          class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700/60 cursor-pointer"
        ><Plus class="w-3.5 h-3.5" /></button>
        <button
          onclick={() => applyEndChange(endTime + 1)}
          title="Increase 1s"
          class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700/60 text-xs font-mono font-medium cursor-pointer"
        >+1s</button>
      </div>
    </div>
  </div>
</div>
