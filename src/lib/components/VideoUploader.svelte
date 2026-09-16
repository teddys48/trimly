<script lang="ts">
  import { Upload, Film, FileVideo, AlertCircle } from 'lucide-svelte';
  import { validateVideoFile } from '../utils/validation';

  let { onFileSelect }: { onFileSelect: (file: File) => void } = $props();

  let isDragging = $state(false);
  let errorMessage = $state<string | null>(null);
  let fileInput: HTMLInputElement;

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      errorMessage = validation.error || 'Invalid file format.';
      return;
    }

    errorMessage = null;
    onFileSelect(file);
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    handleFiles(e.dataTransfer?.files || null);
  }

  function onInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    handleFiles(target.files);
  }
</script>

<div class="w-full">
  <div
    ondragover={onDragOver}
    ondragleave={onDragLeave}
    ondrop={onDrop}
    role="button"
    tabindex="0"
    onclick={() => fileInput?.click()}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput?.click()}
    class="relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 flex flex-col items-center justify-center gap-4 bg-white/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/80 border-slate-300 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm dark:shadow-inner overflow-hidden {isDragging ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 scale-[1.005]' : ''}"
  >
    <!-- Background subtle pattern -->
    <div class="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05] pointer-events-none"></div>

    <div class="relative z-10 w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300 shadow-md">
      <Upload class="w-8 h-8" />
    </div>

    <div class="relative z-10 max-w-md">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
        Choose a video file or drag & drop
      </h2>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
        High-speed local processing. Your video never leaves your browser memory.
      </p>
    </div>

    <!-- Supported formats -->
    <div class="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-2">
      <span class="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1 shadow-xs">
        <Film class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> MP4
      </span>
      <span class="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1 shadow-xs">
        <FileVideo class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> WebM
      </span>
      <span class="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1 shadow-xs">
        <FileVideo class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> MOV
      </span>
      <span class="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1 shadow-xs">
        <FileVideo class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> MKV
      </span>
    </div>

    <button
      type="button"
      class="relative z-10 mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
    >
      Browse Video File
    </button>

    <input
      bind:this={fileInput}
      type="file"
      accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv,.avi"
      onchange={onInputChange}
      class="hidden"
    />
  </div>

  {#if errorMessage}
    <div class="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3 animate-fade-in">
      <AlertCircle class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
      <span>{errorMessage}</span>
    </div>
  {/if}
</div>
