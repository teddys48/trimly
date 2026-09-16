<script lang="ts">
  import { onMount } from 'svelte';
  import { Scissors, Sun, Moon, Github, ShieldCheck } from 'lucide-svelte';

  let { isDark = $bindable(true) }: { isDark?: boolean } = $props();

  function applyTheme(dark: boolean) {
    isDark = dark;
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (dark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
      try {
        localStorage.setItem('trimly-theme', dark ? 'dark' : 'light');
      } catch {}
    }
  }

  onMount(() => {
    try {
      const savedTheme = localStorage.getItem('trimly-theme');
      if (savedTheme) {
        applyTheme(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark);
      }
    } catch {
      applyTheme(true);
    }
  });

  function toggleTheme() {
    applyTheme(!isDark);
  }
</script>

<header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
    <!-- Brand Logo -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
        <Scissors class="w-5 h-5 -rotate-45" />
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">Trimly</h1>
          <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">WASM</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 font-normal hidden sm:block">Browser-Only Video Trimmer</p>
      </div>
    </div>

    <!-- Right utilities -->
    <div class="flex items-center gap-3">
      <div class="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>100% Private</span>
      </div>

      <button
        onclick={toggleTheme}
        aria-label="Toggle dark/light theme"
        class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700/50 cursor-pointer"
      >
        {#if isDark}
          <Sun class="w-4 h-4 text-amber-400" />
        {:else}
          <Moon class="w-4 h-4 text-indigo-600" />
        {/if}
      </button>

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700/50"
      >
        <Github class="w-4 h-4" />
      </a>
    </div>
  </div>
</header>
