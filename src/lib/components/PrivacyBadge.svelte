<script lang="ts">
  import { Lock, Cpu, ServerOff } from 'lucide-svelte';
</script>

<div class="bg-gradient-to-r from-indigo-50 via-slate-100 to-purple-50 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm transition-colors">
  <div class="flex items-center gap-3">
    <div class="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
      <Lock class="w-5 h-5" />
    </div>
    <div>
      <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">Your video never leaves your device.</h3>
      <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
        All trimming is performed locally using WebAssembly in your browser. No server uploads, no cloud APIs.
      </p>
    </div>
  </div>

  <div class="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 shrink-0">
    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 shadow-sm">
      <Cpu class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> WebAssembly
    </span>
    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 shadow-sm">
      <ServerOff class="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> Zero Uploads
    </span>
  </div>
</div>
