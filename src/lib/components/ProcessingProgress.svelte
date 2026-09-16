<script lang="ts">
  import { Loader2, XCircle, Cpu } from 'lucide-svelte';

  let {
    progress = 0,
    statusMessage = 'Processing video locally...',
    onCancel
  }: {
    progress: number;
    statusMessage?: string;
    onCancel: () => void;
  } = $props();
</script>

<div class="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-500/30 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center gap-6 text-center animate-fade-in my-6 transition-colors">
  <div class="relative w-16 h-16 flex items-center justify-center">
    <!-- Outer spinning ring -->
    <div class="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
    <div class="p-3 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
      <Cpu class="w-6 h-6 animate-pulse" />
    </div>
  </div>

  <div class="max-w-md w-full space-y-2">
    <div class="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200 px-1">
      <span class="flex items-center gap-2">
        <Loader2 class="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
        <span>{statusMessage}</span>
      </span>
      <span class="font-mono text-indigo-600 dark:text-indigo-400">{progress}%</span>
    </div>

    <!-- Progress track -->
    <div class="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
      <div
        class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
        style="width: {Math.max(4, Math.min(100, progress))}%;"
      ></div>
    </div>
  </div>

  <div class="flex items-center gap-4">
    <button
      type="button"
      onclick={onCancel}
      class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-300 border border-slate-200 hover:border-rose-200 dark:border-slate-700 dark:hover:border-rose-500/30 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
    >
      <XCircle class="w-4 h-4 text-rose-500 dark:text-rose-400" />
      <span>Cancel Trimming</span>
    </button>
  </div>
</div>
