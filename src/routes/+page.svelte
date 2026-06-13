<script lang="ts">
  import { resolve } from "$app/paths";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Sistem Informasi Lab Informatika</title>
</svelte:head>

<div
  class="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/30 overflow-hidden"
>
  <!-- Navbar -->
  <header
    class="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20"
      >
        LI
      </div>
      <span class="text-xl font-bold text-slate-800 tracking-tight"
        >Lab Informatika</span
      >
    </div>
    <div class="flex items-center gap-6">
      <div class="hidden md:flex items-center gap-8">
        <a
          href={resolve("/surat")}
          class="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >Persuratan</a
        >
        <a
          href={resolve("/keuangan")}
          class="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
          >Keuangan</a
        >
      </div>
      <div class="flex items-center gap-4">
        {#if data.user}
          <div
            class="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-sm"
          >
            <div
              class="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-indigo-500/10"
            >
              {data.user.nama.charAt(0).toUpperCase()}
            </div>
            <span
              class="text-xs font-bold text-slate-700 max-w-[120px] truncate"
              >{data.user.nama}</span
            >
            <div class="h-4 w-px bg-slate-200"></div>
            <form action="/logout" method="POST" class="inline">
              <button
                type="submit"
                class="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                Keluar
              </button>
            </form>
          </div>
        {:else}
          <a
            href={resolve("/login")}
            class="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:scale-105 transition-all"
          >
            Masuk
          </a>
        {/if}
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main
    class="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center"
  >
    <!-- Decorative blobs -->
    <div
      class="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300/20 blur-[120px] rounded-full -z-10 animate-pulse"
    ></div>
    <div
      class="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-300/20 blur-[120px] rounded-full -z-10 animate-pulse"
      style="animation-delay: 1s"
    ></div>

    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm"
    >
      <span class="relative flex h-2 w-2">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"
        ></span>
      </span>
      Integrated Dashboard v2.0
    </div>

    <h1
      class="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 max-w-4xl tracking-tight"
    >
      Sistem <span class="text-indigo-600">Surat</span> &
      <span class="text-emerald-500">Keuangan</span> Lab Informatika
    </h1>

    <p
      class="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed"
    >
      Manajemen penomoran surat otomatis dan pelaporan arus kas laboratorium
      dalam satu platform terpadu.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <a
        href={resolve("/surat")}
        class="group px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
      >
        Mulai Persuratan
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 group-hover:translate-x-1 transition-transform"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
      <a
        href={resolve("/keuangan")}
        class="px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-2xl font-bold shadow-lg hover:bg-slate-50 hover:scale-105 transition-all flex items-center justify-center gap-2"
      >
        Akses Keuangan
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-emerald-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fill-rule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24 w-full max-w-4xl">
      <div
        class="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 shadow-sm text-left group hover:border-indigo-200 transition-colors"
      >
        <div
          class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-3">Persuratan</h3>
        <p class="text-slate-500 text-sm leading-relaxed">
          Penomoran surat otomatis dan manajemen arsip digital.
        </p>
      </div>

      <div
        class="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 shadow-sm text-left group hover:border-emerald-200 transition-colors"
      >
        <div
          class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-3">Keuangan</h3>
        <p class="text-slate-500 text-sm leading-relaxed">
          Pencatatan kas masuk/keluar dan saldo otomatis.
        </p>
      </div>
    </div>
  </main>
</div>
