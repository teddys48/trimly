<script lang="ts">
  import { Play, Scissors, RefreshCw } from 'lucide-svelte';

  let {
    onPreviewRange,
    onTrim,
    onChangeVideo,
    isProcessing = false
  }: {
    onPreviewRange: () => void;
    onTrim: () => void;
    onChangeVideo: () => void;
    isProcessing?: boolean;
  } = $props();
</script>

<div class="flex flex-wrap items-center justify-between gap-4 pt-2">
  <button
    type="button"
    onclick={onChangeVideo}
    disabled={isProcessing}
    class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-all border border-slate-200 dark:border-slate-700/60 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
  >
    <RefreshCw class="w-4 h-4 text-slate-400" />
    <span>Choose Different Video</span>
  </button>

  <div class="flex items-center gap-3 w-full sm:w-auto">
    <button
      type="button"
      onclick={onPreviewRange}
      disabled={isProcessing}
      class="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium text-sm transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
    >
      <Play class="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-500/20" />
      <span>Preview Selection</span>
    </button>

    <button
      type="button"
      onclick={onTrim}
      disabled={isProcessing}
      class="flex-1 sm:flex-initial px-7 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
    >
      <Scissors class="w-4 h-4 -rotate-45" />
      <span>Trim Video</span>
    </button>
  </div>
</div>
