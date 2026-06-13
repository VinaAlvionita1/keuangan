import { db } from '$lib/server/db';
import { letters, suratMasuk, jenisDokumen, users, sessions } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq, and, max, desc } from 'drizzle-orm';
import { getRomanNumeral } from '$lib/utils';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { hashPassword } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	const allSuratKeluar = await db.select().from(letters).orderBy(desc(letters.tanggal), desc(letters.id));
	const allSuratMasuk = await db.select().from(suratMasuk).orderBy(desc(suratMasuk.tanggalTerima), desc(suratMasuk.id));
	const allJenis = await db.select().from(jenisDokumen).orderBy(jenisDokumen.nama);
	const allUsers = await db.select({
		id: users.id,
		username: users.username,
		nama: users.nama,
		role: users.role
	}).from(users).orderBy(users.nama);
	
	return {
		suratKeluar: allSuratKeluar,
		suratMasuk: allSuratMasuk,
		jenisDokumen: allJenis,
		usersList: allUsers
	};
};

export const actions: Actions = {
	createKeluar: async ({ request }) => {
		const data = await request.formData();
		const tanggalStr = data.get('tanggal')?.toString();
		const jenis = data.get('jenis')?.toString();
		const perihal = data.get('perihal')?.toString();
		const klien = data.get('klien')?.toString();
		const status = data.get('status')?.toString();
		const deskripsiSingkat = data.get('deskripsi_singkat')?.toString() || null;
		const file = data.get('file') as File;

		if (!tanggalStr || !jenis || !perihal || !klien || !status) {
			return fail(400, { missing: true, message: 'Harap isi semua kolom wajib untuk Surat Keluar' });
		}

		let fileLink = null;
		if (file && file.size > 0) {
			const ext = file.name.split('.').pop();
			const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
			const filePath = join(process.cwd(), 'static', 'uploads', filename);
			const buffer = Buffer.from(await file.arrayBuffer());
			writeFileSync(filePath, buffer);
			fileLink = `/uploads/${filename}`;
		}

		const tanggal = new Date(tanggalStr);
		const year = tanggal.getFullYear();
		const month = tanggal.getMonth() + 1;

		const result = await db
			.select({ maxUrutan: max(letters.urutan) })
			.from(letters)
			.where(and(eq(letters.year, year), eq(letters.jenis, jenis)));

		const currentMax = result[0]?.maxUrutan ?? 0;
		const nextUrutan = currentMax + 1;

		const romanMonth = getRomanNumeral(month);
		const paddedUrutan = nextUrutan.toString().padStart(3, '0');
		const nomorSurat = `LAB-INF/${jenis}/${paddedUrutan}/${romanMonth}/${year}`;

		await db.insert(letters).values({
			tanggal,
			nomorSurat,
			jenis,
			perihal,
			klien,
			status,
			fileLink,
			deskripsiSingkat,
			year,
			urutan: nextUrutan
		});

		return { success: true };
	},
	createMasuk: async ({ request }) => {
		const data = await request.formData();
		const tanggalTerimaStr = data.get('tanggal_terima')?.toString();
		const nomorSurat = data.get('nomor_surat')?.toString();
		const pengirim = data.get('pengirim')?.toString();
		const perihal = data.get('perihal')?.toString();
		const status = data.get('status')?.toString();
		const deskripsiSingkat = data.get('deskripsi_singkat')?.toString() || null;
		const file = data.get('file') as File;

		if (!tanggalTerimaStr || !nomorSurat || !pengirim || !perihal || !status) {
			return fail(400, { missing: true, message: 'Harap isi semua kolom wajib untuk Surat Masuk' });
		}

		let fileLink = null;
		if (file && file.size > 0) {
			const ext = file.name.split('.').pop();
			const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
			const filePath = join(process.cwd(), 'static', 'uploads', filename);
			const buffer = Buffer.from(await file.arrayBuffer());
			writeFileSync(filePath, buffer);
			fileLink = `/uploads/${filename}`;
		}

		const tanggalTerima = new Date(tanggalTerimaStr);

		await db.insert(suratMasuk).values({
			tanggalTerima,
			nomorSurat,
			pengirim,
			perihal,
			status,
			fileLink,
			deskripsiSingkat
		});

		return { success: true };
	},
	createJenis: async ({ request }) => {
		const data = await request.formData();
		const kode = data.get('kode')?.toString()?.toUpperCase();
		const nama = data.get('nama')?.toString();

		if (!kode || !nama) {
			return fail(400, { missing: true, message: 'Harap isi kode dan nama jenis dokumen' });
		}

		await db.insert(jenisDokumen).values({ kode, nama });
		return { success: true };
	},
	updateJenis: async ({ request }) => {
		const data = await request.formData();
		const idStr = data.get('id')?.toString();
		const kode = data.get('kode')?.toString()?.toUpperCase();
		const nama = data.get('nama')?.toString();

		if (!idStr || !kode || !nama) {
			return fail(400, { missing: true, message: 'Data tidak lengkap' });
		}

		await db.update(jenisDokumen)
			.set({ kode, nama })
			.where(eq(jenisDokumen.id, parseInt(idStr)));

		return { success: true };
	},
	deleteJenis: async ({ request }) => {
		const data = await request.formData();
		const idStr = data.get('id')?.toString();

		if (!idStr) {
			return fail(400, { missing: true, message: 'ID tidak ditemukan' });
		}

		await db.delete(jenisDokumen)
			.where(eq(jenisDokumen.id, parseInt(idStr)));

		return { success: true };
	},
	createUser: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { missing: true, message: 'Tidak diizinkan' });
		}

		const data = await request.formData();
		const nama = data.get('nama')?.toString()?.trim();
		const username = data.get('username')?.toString()?.trim();
		const password = data.get('password')?.toString();
		const role = data.get('role')?.toString() || 'admin';

		if (!nama || !username || !password) {
			return fail(400, { missing: true, message: 'Harap isi semua kolom' });
		}

		if (password.length < 6) {
			return fail(400, { missing: true, message: 'Password minimal terdiri dari 6 karakter' });
		}

		// Check if username already exists
		const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
		if (existing.length > 0) {
			return fail(400, { missing: true, message: 'Username sudah digunakan' });
		}

		const passwordHash = hashPassword(password);
		await db.insert(users).values({
			nama,
			username,
			passwordHash,
			role
		});

		return { success: true };
	},
	deleteUser: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { missing: true, message: 'Tidak diizinkan' });
		}

		const data = await request.formData();
		const idStr = data.get('id')?.toString();

		if (!idStr) {
			return fail(400, { missing: true, message: 'ID tidak ditemukan' });
		}

		const id = parseInt(idStr);

		// Prevent self-deletion
		if (id === locals.user.id) {
			return fail(400, { missing: true, message: 'Anda tidak dapat menghapus akun Anda sendiri' });
		}

		// Delete sessions first
		await db.delete(sessions).where(eq(sessions.userId, id));
		// Delete user
		await db.delete(users).where(eq(users.id, id));

		return { success: true };
	}
};
