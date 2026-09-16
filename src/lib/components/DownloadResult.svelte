<script lang="ts">
  import { Download, CheckCircle2, RefreshCw, FileCheck, Clock, HardDrive } from 'lucide-svelte';
  import { formatFileSize } from '../utils/file';
  import { formatTime } from '../utils/time';

  let {
    outputUrl,
    outputFilename,
    outputSize,
    clipDuration,
    originalSize,
    onReset
  }: {
    outputUrl: string;
    outputFilename: string;
    outputSize: number;
    clipDuration: number;
    originalSize?: number;
    onReset: () => void;
  } = $props();

  function triggerDownload() {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
</script>

<div class="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-6 animate-fade-in transition-colors">
  <!-- Header Success Banner -->
  <div class="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
    <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 class="w-6 h-6" />
    </div>
    <div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Video Trimmed Successfully!</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400">Processed locally with browser WebAssembly</p>
    </div>
  </div>

  <!-- Video Preview Player -->
  <div class="relative rounded-2xl bg-black overflow-hidden border border-slate-300 dark:border-slate-800 max-h-[45vh] flex items-center justify-center">
    <video src={outputUrl} controls class="max-h-[45vh] w-full object-contain">
      <track kind="captions" />
    </video>
  </div>

  <!-- Output File Metadata Stats -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div class="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
      <FileCheck class="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
      <div class="min-w-0">
        <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Filename</p>
        <p class="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate">{outputFilename}</p>
      </div>
    </div>

    <div class="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
      <Clock class="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
      <div>
        <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Clip Duration</p>
        <p class="text-xs font-mono font-medium text-slate-800 dark:text-slate-200">{formatTime(clipDuration)}</p>
      </div>
    </div>

    <div class="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
      <HardDrive class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
      <div>
        <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">File Size</p>
        <p class="text-xs font-mono font-medium text-slate-800 dark:text-slate-200">{formatFileSize(outputSize)}</p>
      </div>
    </div>
  </div>

  <!-- Action Controls -->
  <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
    <button
      type="button"
      onclick={onReset}
      class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer"
    >
      <RefreshCw class="w-4 h-4 text-slate-400" />
      <span>Trim Another Video</span>
    </button>

    <button
      type="button"
      onclick={triggerDownload}
      class="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2 active:scale-95 cursor-pointer"
    >
      <Download class="w-5 h-5" />
      <span>Download Trimmed Video</span>
    </button>
  </div>
</div>
