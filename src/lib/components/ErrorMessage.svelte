<script lang="ts">
  import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-svelte';

  let {
    message = 'An unexpected error occurred during processing.',
    detail,
    onRetry
  }: {
    message?: string;
    detail?: string;
    onRetry: () => void;
  } = $props();

  let showDetails = $state(false);
</script>

<div class="p-6 rounded-3xl bg-rose-500/10 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-500/30 backdrop-blur-md shadow-2xl space-y-4 animate-fade-in my-4 transition-colors">
  <div class="flex items-start gap-4">
    <div class="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0 mt-0.5">
      <AlertTriangle class="w-6 h-6" />
    </div>
    <div class="space-y-1 flex-1">
      <h3 class="text-base font-bold text-rose-800 dark:text-rose-200">Trimming Error</h3>
      <p class="text-sm text-rose-700 dark:text-rose-300/90">{message}</p>
    </div>
  </div>

  {#if detail}
    <div class="pt-2 border-t border-rose-200 dark:border-rose-900/40">
      <button
        type="button"
        onclick={() => (showDetails = !showDetails)}
        class="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
      >
        <span>{showDetails ? 'Hide technical details' : 'Show technical details'}</span>
        {#if showDetails}
          <ChevronUp class="w-3.5 h-3.5" />
        {:else}
          <ChevronDown class="w-3.5 h-3.5" />
        {/if}
      </button>

      {#if showDetails}
        <pre class="mt-2.5 p-3.5 rounded-xl bg-slate-900 dark:bg-slate-950 border border-rose-900/50 text-slate-200 dark:text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-48 leading-relaxed">
{detail}
        </pre>
      {/if}
    </div>
  {/if}

  <div class="flex justify-end pt-2">
    <button
      type="button"
      onclick={onRetry}
      class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
    >
      <RefreshCw class="w-3.5 h-3.5" />
      <span>Try Again</span>
    </button>
  </div>
</div>
