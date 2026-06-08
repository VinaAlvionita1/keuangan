<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let processing = $state(false);

	// Calculate cumulative balance
	// We need to calculate from oldest to newest to get the correct cumulative saldo
	let currentBalance = 0;
	const transactionsWithSaldo = [...data.transaksi]
		.reverse() // Start from oldest
		.map((t) => {
			if (t.tipe === 'masuk') currentBalance += t.nominal;
			else currentBalance -= t.nominal;
			return { ...t, saldo: currentBalance };
		})
		.reverse(); // Back to newest at top

	function formatRupiah(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	let totalMasuk = $derived(data.transaksi.filter(t => t.tipe === 'masuk').reduce((acc, t) => acc + t.nominal, 0));
	let totalKeluar = $derived(data.transaksi.filter(t => t.tipe === 'keluar').reduce((acc, t) => acc + t.nominal, 0));
	let saldoAkhir = $derived(totalMasuk - totalKeluar);
</script>

<svelte:head>
	<title>Keuangan | Lab Informatika</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500/30">
	<!-- Top Navigation / Header -->
	<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
						Rp
					</div>
					<div>
						<h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
							Laporan Keuangan
						</h1>
						<p class="text-xs text-slate-500 font-medium tracking-wide">LABORATORIUM INFORMATIKA</p>
					</div>
				</div>
				<div class="flex items-center gap-6">
					<nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
						<a href="/" class="hover:text-indigo-600 transition-colors">Beranda</a>
						<a href="/surat" class="hover:text-indigo-600 transition-colors">Persuratan</a>
						<a href="/keuangan" class="text-emerald-600">Keuangan</a>
					</nav>
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		
		<!-- Financial Overview Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
				<p class="text-sm font-medium text-slate-500 mb-1">Total Uang Masuk</p>
				<h3 class="text-2xl font-bold text-emerald-600">{formatRupiah(totalMasuk)}</h3>
			</div>
			<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
				<p class="text-sm font-medium text-slate-500 mb-1">Total Uang Keluar</p>
				<h3 class="text-2xl font-bold text-rose-600">{formatRupiah(totalKeluar)}</h3>
			</div>
			<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
				<p class="text-sm font-medium text-slate-500 mb-1">Saldo Akhir</p>
				<h3 class="text-2xl font-bold text-slate-800">{formatRupiah(saldoAkhir)}</h3>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
			
			<!-- Left Column: Add Transaction Form -->
			<div class="lg:col-span-4">
				<div class="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden sticky top-24">
					<div class="px-6 py-5 border-b border-slate-100 bg-emerald-50">
						<h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
							</svg>
							Input Transaksi
						</h2>
					</div>
					
					<form 
						method="POST" 
						action="?/add" 
						class="p-6 space-y-5"
						use:enhance={() => {
							processing = true;
							return async ({ update }) => {
								await update();
								processing = false;
							};
						}}
					>
						{#if form?.missing}
							<div class="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm">
								{form?.message}
							</div>
						{/if}

						<div class="space-y-1.5">
							<label for="tanggal" class="block text-sm font-medium text-slate-700">Tanggal</label>
							<input type="date" id="tanggal" name="tanggal" required
								value={new Date().toISOString().split('T')[0]}
								class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all" />
						</div>

						<div class="space-y-1.5">
							<label for="keterangan" class="block text-sm font-medium text-slate-700">Keterangan</label>
							<textarea id="keterangan" name="keterangan" required placeholder="Contoh: Pembelian tinta printer"
								class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all placeholder:text-slate-400 resize-none"></textarea>
						</div>

						<div class="space-y-1.5">
							<label for="tipe" class="block text-sm font-medium text-slate-700">Tipe Transaksi</label>
							<select id="tipe" name="tipe" required
								class="block w-full rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all">
								<option value="masuk">📥 Uang Masuk</option>
								<option value="keluar">📤 Uang Keluar</option>
							</select>
						</div>

						<div class="space-y-1.5">
							<label for="nominal" class="block text-sm font-medium text-slate-700">Nominal (Rp)</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-slate-500 sm:text-sm">Rp</span>
								</div>
								<input type="number" id="nominal" name="nominal" required min="1" placeholder="0"
									class="block w-full pl-10 rounded-xl bg-white border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all placeholder:text-slate-400" />
							</div>
						</div>

						<button type="submit" disabled={processing}
							class="mt-4 flex w-full justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-3 py-3 text-sm font-semibold text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
							{#if processing}
								<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Menyimpan...
							{:else}
								Tambah Transaksi
							{/if}
						</button>
					</form>
				</div>
			</div>

			<!-- Right Column: Transaction Report Table -->
			<div class="lg:col-span-8">
				<div class="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full min-h-[600px]">
					<div class="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
						<h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A1 1 0 0113.293 2.707l3 3a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
							</svg>
							Laporan Transaksi
						</h2>
						<div class="text-xs font-medium text-slate-500">
							Menampilkan {data.transaksi.length} transaksi terbaru
						</div>
					</div>

					<div class="overflow-x-auto flex-1">
						<table class="min-w-full divide-y divide-slate-200 text-sm">
							<thead class="bg-slate-50">
								<tr>
									<th scope="col" class="py-3.5 pl-4 pr-3 text-left font-semibold text-slate-700 sm:pl-6 w-12">No</th>
									<th scope="col" class="px-3 py-3.5 text-left font-semibold text-slate-700">Tanggal</th>
									<th scope="col" class="px-3 py-3.5 text-left font-semibold text-slate-700">Keterangan</th>
									<th scope="col" class="px-3 py-3.5 text-right font-semibold text-slate-700">Uang Masuk</th>
									<th scope="col" class="px-3 py-3.5 text-right font-semibold text-slate-700">Uang Keluar</th>
									<th scope="col" class="py-3.5 pl-3 pr-4 text-right font-semibold text-slate-700 sm:pr-6">Saldo</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100 bg-white">
								{#if transactionsWithSaldo.length === 0}
									<tr>
										<td colspan="6" class="px-6 py-12 text-center text-slate-500 italic">
											Belum ada data transaksi keuangan.
										</td>
									</tr>
								{/if}
								{#each transactionsWithSaldo as t, i}
									<tr class="hover:bg-slate-50 transition-colors">
										<td class="whitespace-nowrap py-4 pl-4 pr-3 text-slate-500 font-mono sm:pl-6">
											{transactionsWithSaldo.length - i}
										</td>
										<td class="whitespace-nowrap px-3 py-4 text-xs text-slate-400">
											{new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(t.tanggal))}
										</td>
										<td class="px-3 py-4 text-slate-800 font-medium">
											{t.keterangan}
										</td>
										<td class="whitespace-nowrap px-3 py-4 text-right text-emerald-600 font-semibold">
											{t.tipe === 'masuk' ? formatRupiah(t.nominal) : '-'}
										</td>
										<td class="whitespace-nowrap px-3 py-4 text-right text-rose-600 font-semibold">
											{t.tipe === 'keluar' ? formatRupiah(t.nominal) : '-'}
										</td>
										<td class="whitespace-nowrap py-4 pl-3 pr-4 text-right font-bold text-slate-700 sm:pr-6">
											{formatRupiah(t.saldo)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			
		</div>
	</main>
</div>
