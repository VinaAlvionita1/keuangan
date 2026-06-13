<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let loading = $state(false);
</script>

<svelte:head>
  <title
    >{data.firstTimeSetup
      ? "Setup Admin | Lab Informatika"
      : "Masuk | Lab Informatika"}</title
  >
</svelte:head>

<div
  class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30 font-sans"
>
  <!-- Background decorations -->
  <div
    class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full -z-10 animate-pulse"
  ></div>
  <div
    class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full -z-10 animate-pulse"
    style="animation-delay: 1.5s"
  ></div>

  <div class="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
    <div class="flex justify-center mb-6">
      <div
        class="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-indigo-500/30 scale-100 hover:scale-105 transition-transform duration-300"
      >
        LI
      </div>
    </div>
    <h2 class="text-center text-3xl font-extrabold text-white tracking-tight">
      {data.firstTimeSetup
        ? "Setup Akun Administrator"
        : "Sistem Informasi Lab"}
    </h2>
    <p class="mt-2 text-center text-sm text-slate-400">
      {data.firstTimeSetup
        ? "Mulai langkah pertama dengan membuat akun pengelola laboratorium"
        : "Masuk untuk mengelola persuratan dan laporan keuangan"}
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
    <div
      class="bg-slate-900/60 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-800/80"
    >
      <form
        method="POST"
        action={data.firstTimeSetup ? "?/register" : "?/login"}
        class="space-y-6"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
      >
        {#if form?.message}
          <div
            class="p-4 rounded-2xl {form.invalid ||
            form.missing ||
            form.forbidden ||
            form.error
              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'} text-sm flex items-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{form.message}</span>
          </div>
        {/if}

        {#if data.firstTimeSetup}
          <div>
            <label
              for="nama"
              class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"
              >Nama Lengkap</label
            >
            <div class="relative rounded-2xl shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="nama"
                name="nama"
                required
                placeholder="Nama Lengkap Anda"
                class="block w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>
        {/if}

        <div>
          <label
            for="username"
            class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"
            >Username</label
          >
          <div class="relative rounded-2xl shadow-sm">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5A2.5 2.5 0 0010 5a2.5 2.5 0 00-2.5 2.5v2A2.5 2.5 0 0010 12a2.5 2.5 0 002.5-2.5v-2zM10 2a8 8 0 100 16 8 8 0 000-16z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="admin"
              class="block w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"
            >Password</label
          >
          <div class="relative rounded-2xl shadow-sm">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              class="block w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-linear-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/50 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {#if loading}
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses...
            {:else}
              {data.firstTimeSetup ? "Daftar & Masuk" : "Masuk ke Sistem"}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
