import { db } from '$lib/server/db';
import { transaksi } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allTransaksi = await db.select().from(transaksi).orderBy(desc(transaksi.tanggal), desc(transaksi.id));
	
	return {
		transaksi: allTransaksi
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const tanggalStr = data.get('tanggal')?.toString();
		const keterangan = data.get('keterangan')?.toString();
		const tipe = data.get('tipe')?.toString();
		const nominal = parseInt(data.get('nominal')?.toString() || '0');

		if (!tanggalStr || !keterangan || !tipe || nominal <= 0) {
			return fail(400, { missing: true, message: 'Harap isi semua kolom dengan benar' });
		}

		await db.insert(transaksi).values({
			tanggal: new Date(tanggalStr),
			keterangan,
			tipe,
			nominal
		});

		return { success: true };
	}
};
