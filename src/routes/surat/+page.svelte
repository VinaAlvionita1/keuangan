<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let creating = $state(false);
	let activeTab = $state<'keluar' | 'masuk' | 'pengaturan'>('keluar');
	let searchQuery = $state('');

	// State for Document Type editing
	let editingId = $state<number | null>(null);
	let editKode = $state('');
	let editNama = $state('');

	let filteredSuratKeluar = $derived(
		data.suratKeluar.filter(letter => 
			letter.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
			letter.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
			letter.klien.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let filteredSuratMasuk = $derived(
		data.suratMasuk.filter(letter => 
			letter.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
			letter.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
			letter.pengirim.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function startEdit(doc: typeof data.jenisDokumen[0]) {
		editingId = doc.id;
		editKode = doc.kode;
		editNama = doc.nama;
		activeTab = 'pengaturan'; // Ensure we are on the right tab if called from somewhere else
	}

	function cancelEdit() {
		editingId = null;
		editKode = '';
		editNama = '';
	}
</script>

<svelte:head>
	<title>Persuratan | Lab Informatika</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/30">
	<!-- Top Navigation / Header -->
	<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
						LI
					</div>
					<div>
						<h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
							Persuratan
						</h1>
						<p class="text-xs text-slate-500 font-medium tracking-wide">LABORATORIUM INFORMATIKA</p>
					</div>
				</div>
				<div class="flex items-center gap-6">
					<nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
						<a href="/" class="hover:text-indigo-600 transition-colors">Beranda</a>
						<a href="/surat" class="text-indigo-600">Persuratan</a>
						<a href="/keuangan" class="hover:text-emerald-600 transition-colors">Keuangan</a>
					</nav>
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		
		<!-- Tab Switcher Global -->
		<div class="flex justify-center mb-8">
			<div class="bg-white p-1 rounded-xl flex gap-1 border border-slate-200 shadow-md">
				<button 
					class="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all {activeTab === 'keluar' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}"
					onclick={() => activeTab = 'keluar'}
				>
					Surat Keluar
				</button>
				<button 
					class="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all {activeTab === 'masuk' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}"
					onclick={() => activeTab = 'masuk'}
				>
					Surat Masuk
				</button>
				<button 
					class="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all {activeTab === 'pengaturan' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}"
					onclick={() => activeTab = 'pengaturan'}
				>
					Pengaturan Jenis
				</button>
			</div>
		</div>

		<!-- Main Content Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
			
			<!-- Left Column: Form -->
			<div class="lg:col-span-4">
				<div class="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden sticky top-24">
					<div class="px-6 py-5 border-b border-slate-100 {activeTab === 'keluar' ? 'bg-indigo-50' : activeTab === 'masuk' ? 'bg-purple-50' : 'bg-slate-50'} transition-colors flex justify-between items-center">
						<h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {activeTab === 'keluar' ? 'text-indigo-500' : activeTab === 'masuk' ? 'text-purple-500' : 'text-slate-600'}" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
							</svg>
							{#if activeTab === 'pengaturan'}
								{editingId ? 'Edit Jenis Dokumen' : 'Tambah Jenis Dokumen'}
							{:else}
								{activeTab === 'keluar' ? 'Buat Surat Keluar' : 'Register Surat Masuk'}
							{/if}
						</h2>
						{#if activeTab === 'pengaturan' && editingId}
							<button onclick={cancelEdit} class="text-xs text-slate-500 hover:text-slate-700 bg-slate-200 px-2 py-1 rounded">Batal</button>
						{/if}
					</div>
					
					<form 
						method="POST" 
						action={
							activeTab === 'keluar' ? '?/createKeluar' : 
							activeTab === 'masuk' ? '?/createMasuk' : 
							(editingId ? '?/updateJenis' : '?/createJenis')
						} 
						class="p-6 space-y-5"
						enctype={activeTab === 'pengaturan' ? 'application/x-www-form-urlencoded' : 'multipart/form-data'}
						use:enhance={() => {
							creating = true;
							return async ({ update }) => {
								await update({ reset: true });
								creating = false;
								if (activeTab === 'pengaturan' && editingId) cancelEdit();
							};
						}}
					>
						{#if form?.missing}
							<div class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
								{form?.message}
							</div>
						{/if}

						{#if activeTab === 'pengaturan'}
							{#if editingId}
								<input type="hidden" name="id" value={editingId} />
							{/if}
							<div class="space-y-1.5">
								<label for="kode" class="block text-sm font-medium text-slate-700">Kode (Misal: SPK, INV)</label>
								<input type="text" id="kode" name="kode" bind:value={editKode} required placeholder="Contoh: SPK"
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 sm:text-sm uppercase transition-all placeholder:text-slate-400 placeholder:normal-case" />
							</div>

							<div class="space-y-1.5">
								<label for="nama" class="block text-sm font-medium text-slate-700">Nama Dokumen</label>
								<input type="text" id="nama" name="nama" bind:value={editNama} required placeholder="Contoh: Surat Perjanjian Kerjasama"
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-all placeholder:text-slate-400" />
							</div>

						{:else if activeTab === 'keluar'}
							<div class="space-y-1.5">
								<label for="tanggal" class="block text-sm font-medium text-slate-700">Tanggal Surat</label>
								<input type="date" id="tanggal" name="tanggal" required
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm sm:leading-6 transition-all" />
							</div>

							<div class="space-y-1.5">
								<label for="jenis" class="block text-sm font-medium text-slate-700">Jenis Dokumen</label>
								<select id="jenis" name="jenis" required
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm sm:leading-6 transition-all">
									<option value="">Pilih Jenis</option>
									{#each data.jenisDokumen as type}
										<option value={type.kode}>{type.kode} - {type.nama}</option>
									{/each}
								</select>
							</div>

							<div class="space-y-1.5">
								<label for="klien" class="block text-sm font-medium text-slate-700">Klien / Pihak Tujuan</label>
								<input type="text" id="klien" name="klien" required placeholder="Contoh: PT. XYZ"
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm sm:leading-6 transition-all placeholder:text-slate-400" />
							</div>

						{:else}
							<div class="space-y-1.5">
								<label for="tanggal_terima" class="block text-sm font-medium text-slate-700">Tanggal Terima</label>
								<input type="date" id="tanggal_terima" name="tanggal_terima" required
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm sm:leading-6 transition-all" />
							</div>

							<div class="space-y-1.5">
								<label for="nomor_surat" class="block text-sm font-medium text-slate-700">Nomor Surat (Asli)</label>
								<input type="text" id="nomor_surat" name="nomor_surat" required placeholder="Contoh: 001/PT-XYZ/IV/2026"
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm sm:leading-6 transition-all placeholder:text-slate-400" />
							</div>

							<div class="space-y-1.5">
								<label for="pengirim" class="block text-sm font-medium text-slate-700">Pengirim</label>
								<input type="text" id="pengirim" name="pengirim" required placeholder="Contoh: PT. XYZ"
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm sm:leading-6 transition-all placeholder:text-slate-400" />
							</div>
						{/if}

						{#if activeTab !== 'pengaturan'}
							<div class="space-y-1.5">
								<label for="perihal" class="block text-sm font-medium text-slate-700">Perihal</label>
								<textarea id="perihal" name="perihal" rows="2" required placeholder="Tujuan surat..."
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 {activeTab === 'keluar' ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-purple-500 focus:border-purple-500'} sm:text-sm sm:leading-6 transition-all placeholder:text-slate-400 resize-none"></textarea>
							</div>

							<div class="space-y-1.5">
								<label for="deskripsi_singkat" class="block text-sm font-medium text-slate-700">Deskripsi Singkat (Opsional)</label>
								<textarea id="deskripsi_singkat" name="deskripsi_singkat" rows="2" placeholder="Catatan tambahan tentang surat..."
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 {activeTab === 'keluar' ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-purple-500 focus:border-purple-500'} sm:text-sm sm:leading-6 transition-all placeholder:text-slate-400 resize-none"></textarea>
							</div>

							<div class="space-y-1.5">
								<label for="status" class="block text-sm font-medium text-slate-700">Status</label>
								<select id="status" name="status" required
									class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 {activeTab === 'keluar' ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-purple-500 focus:border-purple-500'} sm:text-sm sm:leading-6 transition-all">
									{#if activeTab === 'keluar'}
										<option value="Draft">📝 Draft</option>
										<option value="Ditandatangani">✅ Ditandatangani</option>
										<option value="Terkirim">📤 Terkirim</option>
										<option value="Selesai">🏁 Selesai</option>
									{:else}
										<option value="Diterima">📥 Diterima</option>
										<option value="Diproses">⏳ Diproses</option>
										<option value="Selesai">🏁 Selesai</option>
									{/if}
								</select>
							</div>

							<div class="space-y-1.5">
								<label for="file" class="block text-sm font-medium text-slate-700">Upload File (Opsional)</label>
								<input type="file" id="file" name="file"
									class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 transition-all cursor-pointer" />
							</div>
						{/if}

						<button type="submit" disabled={creating}
							class="mt-4 flex w-full justify-center rounded-xl bg-gradient-to-r 
							{activeTab === 'keluar' ? 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus-visible:outline-indigo-500' : 
							 activeTab === 'masuk' ? 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus-visible:outline-purple-500' : 
							 'from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 focus-visible:outline-slate-700'} 
							px-3 py-3 text-sm font-semibold text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
							{#if creating}
								<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Memproses...
							{:else}
								{#if activeTab === 'pengaturan'}
									{editingId ? 'Simpan Perubahan' : 'Simpan Jenis Dokumen'}
								{:else}
									{activeTab === 'keluar' ? 'Generate Nomor Surat' : 'Simpan Surat Masuk'}
								{/if}
							{/if}
						</button>
					</form>
				</div>
			</div>

			<!-- Right Column: Register Table -->
			<div class="lg:col-span-8">
				<div class="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full min-h-[600px]">
					<div class="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
						<h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {activeTab === 'keluar' ? 'text-indigo-500' : activeTab === 'masuk' ? 'text-purple-500' : 'text-slate-600'}" viewBox="0 0 20 20" fill="currentColor">
								<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
								<path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
							</svg>
							{#if activeTab === 'pengaturan'}
								Daftar Jenis Dokumen
							{:else}
								Register {activeTab === 'keluar' ? 'Surat Keluar' : 'Surat Masuk'}
							{/if}
						</h2>
						<div class="flex items-center gap-4">
							{#if activeTab !== 'pengaturan'}
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg class="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
										</svg>
									</div>
									<input type="text" bind:value={searchQuery} placeholder="Cari surat..." class="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-full text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm" />
								</div>
							{/if}
							<div class="text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm whitespace-nowrap">
								Total: {
									activeTab === 'keluar' ? filteredSuratKeluar.length : 
									activeTab === 'masuk' ? filteredSuratMasuk.length : 
									data.jenisDokumen.length
								} Dokumen
							</div>
						</div>
					</div>

					<div class="overflow-x-auto flex-1">
						<table class="min-w-full divide-y divide-slate-200 text-sm">
							<thead class="bg-slate-50">
								{#if activeTab === 'pengaturan'}
									<tr>
										<th scope="col" class="py-3.5 pl-4 pr-3 text-left font-semibold text-slate-700 sm:pl-6 w-24">Kode</th>
										<th scope="col" class="px-3 py-3.5 text-left font-semibold text-slate-700">Nama Dokumen</th>
										<th scope="col" class="py-3.5 pl-3 pr-4 text-right font-semibold text-slate-700 sm:pr-6">Aksi</th>
									</tr>
								{:else}
									<tr>
										<th scope="col" class="py-3.5 pl-4 pr-3 text-left font-semibold text-slate-700 sm:pl-6 w-12">No</th>
										<th scope="col" class="px-3 py-3.5 text-left font-semibold text-slate-700 whitespace-nowrap">{activeTab === 'keluar' ? 'Tanggal' : 'Tgl Terima'}</th>
										<th scope="col" class="px-3 py-3.5 text-left font-semibold text-slate-700">Nomor Surat</th>
										<th scope="col" class="px-3 py-3.5 text-left font-semibold text-slate-700">Perihal & {activeTab === 'keluar' ? 'Klien' : 'Pengirim'}</th>
										<th scope="col" class="px-3 py-3.5 text-left font-semibold text-slate-700">Status</th>
										<th scope="col" class="py-3.5 pl-3 pr-4 text-right font-semibold text-slate-700 sm:pr-6">Aksi</th>
									</tr>
								{/if}
							</thead>
							<tbody class="divide-y divide-slate-100 bg-white">
								{#if activeTab === 'pengaturan'}
									{#if data.jenisDokumen.length === 0}
										<tr>
											<td colspan="3" class="px-6 py-12 text-center text-slate-500">Belum ada jenis dokumen terdaftar.</td>
										</tr>
									{/if}
									{#each data.jenisDokumen as doc}
										<tr class="hover:bg-slate-50 transition-colors {editingId === doc.id ? 'bg-indigo-50/50' : ''}">
											<td class="whitespace-nowrap py-4 pl-4 pr-3 font-medium sm:pl-6">
												<span class="font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">{doc.kode}</span>
											</td>
											<td class="px-3 py-4 text-slate-800">{doc.nama}</td>
											<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
												<div class="flex items-center justify-end gap-3">
													<button onclick={() => startEdit(doc)} class="text-indigo-600 hover:text-indigo-800 transition-colors" title="Edit">
														<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
														</svg>
													</button>
													<form method="POST" action="?/deleteJenis" use:enhance>
														<input type="hidden" name="id" value={doc.id} />
														<button type="submit" class="text-red-500 hover:text-red-700 transition-colors" title="Hapus" onclick={(e) => { if(!confirm('Yakin ingin menghapus jenis dokumen ini?')) e.preventDefault(); }}>
															<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
															</svg>
														</button>
													</form>
												</div>
											</td>
										</tr>
									{/each}
								{:else}
									{#if activeTab === 'keluar'}
										{#if filteredSuratKeluar.length === 0}
											<tr>
												<td colspan="6" class="px-6 py-12 text-center text-slate-500">
													<div class="flex flex-col items-center justify-center">
														<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
														</svg>
														<p>{searchQuery ? 'Tidak ada surat keluar yang cocok dengan pencarian.' : 'Belum ada Surat Keluar yang diregister.'}</p>
													</div>
												</td>
											</tr>
										{/if}
										{#each filteredSuratKeluar as letter, i}
											<tr class="hover:bg-slate-50 transition-colors group">
												<td class="whitespace-nowrap py-4 pl-4 pr-3 font-medium text-slate-600 sm:pl-6">{filteredSuratKeluar.length - i}</td>
												<td class="whitespace-nowrap px-3 py-4 text-slate-600">{new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(letter.tanggal))}</td>
												<td class="px-3 py-4 text-slate-900">
													<div class="font-mono text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block shadow-inner break-all">{letter.nomorSurat}</div>
													<div class="text-xs text-indigo-600 font-semibold mt-1">{data.jenisDokumen.find(t => t.kode === letter.jenis)?.nama || letter.jenis}</div>
												</td>
												<td class="px-3 py-4">
													<div class="text-slate-800 font-medium line-clamp-2">{letter.perihal}</div>
													{#if letter.deskripsiSingkat}<div class="text-xs text-slate-500 mt-1 italic">{letter.deskripsiSingkat}</div>{/if}
													<div class="text-slate-500 text-xs flex items-center mt-1">
														<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
														{letter.klien}
													</div>
												</td>
												<td class="whitespace-nowrap px-3 py-4">
													<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border
														{['Draft', 'Diproses'].includes(letter.status) ? 'bg-amber-100 text-amber-700 border-amber-200' : 
														 ['Ditandatangani', 'Diterima'].includes(letter.status) ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
														 letter.status === 'Terkirim' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
														 letter.status === 'Selesai' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 
														 'bg-slate-100 text-slate-700 border-slate-200'}">{letter.status}</span>
												</td>
												<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
													{#if letter.fileLink}
														<a href={letter.fileLink} target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 inline-flex items-center p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Buka File">
															<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
														</a>
													{/if}
												</td>
											</tr>
										{/each}
									{:else}
										{#if filteredSuratMasuk.length === 0}
											<tr>
												<td colspan="6" class="px-6 py-12 text-center text-slate-500">
													<div class="flex flex-col items-center justify-center">
														<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
														</svg>
														<p>{searchQuery ? 'Tidak ada surat masuk yang cocok dengan pencarian.' : 'Belum ada Surat Masuk yang diregister.'}</p>
													</div>
												</td>
											</tr>
										{/if}
										{#each filteredSuratMasuk as letter, i}
											<tr class="hover:bg-slate-50 transition-colors group">
												<td class="whitespace-nowrap py-4 pl-4 pr-3 font-medium text-slate-600 sm:pl-6">{filteredSuratMasuk.length - i}</td>
												<td class="whitespace-nowrap px-3 py-4 text-slate-600">{new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(letter.tanggalTerima))}</td>
												<td class="px-3 py-4 text-slate-900">
													<div class="font-mono text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block shadow-inner break-all">{letter.nomorSurat}</div>
												</td>
												<td class="px-3 py-4">
													<div class="text-slate-800 font-medium line-clamp-2">{letter.perihal}</div>
													{#if letter.deskripsiSingkat}<div class="text-xs text-slate-500 mt-1 italic">{letter.deskripsiSingkat}</div>{/if}
													<div class="text-slate-500 text-xs flex items-center mt-1">
														<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
														{letter.pengirim}
													</div>
												</td>
												<td class="whitespace-nowrap px-3 py-4">
													<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border
														{['Draft', 'Diproses'].includes(letter.status) ? 'bg-amber-100 text-amber-700 border-amber-200' : 
														 ['Ditandatangani', 'Diterima'].includes(letter.status) ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
														 letter.status === 'Terkirim' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
														 letter.status === 'Selesai' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
														 'bg-slate-100 text-slate-700 border-slate-200'}">{letter.status}</span>
												</td>
												<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
													{#if letter.fileLink}
														<a href={letter.fileLink} target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:text-purple-800 inline-flex items-center p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Buka File">
															<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
														</a>
													{/if}
												</td>
											</tr>
										{/each}
									{/if}
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			
		</div>
	</main>
</div>
