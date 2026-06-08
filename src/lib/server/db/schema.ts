import { mysqlTable, serial, int, text, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const letters = mysqlTable('letters', {
	id: int('id').autoincrement().primaryKey(),
	tanggal: timestamp('tanggal').notNull(),
	nomorSurat: text('nomor_surat').notNull(),
	jenis: varchar('jenis', { length: 50 }).notNull(),
	perihal: text('perihal').notNull(),
	klien: text('klien').notNull(),
	status: varchar('status', { length: 50 }).notNull(),
	fileLink: text('file_link'),
	deskripsiSingkat: text('deskripsi_singkat'),
	year: int('year').notNull(),
	urutan: int('urutan').notNull()
});

export const suratMasuk = mysqlTable('surat_masuk', {
	id: int('id').autoincrement().primaryKey(),
	tanggalTerima: timestamp('tanggal_terima').notNull(),
	nomorSurat: text('nomor_surat').notNull(),
	pengirim: text('pengirim').notNull(),
	perihal: text('perihal').notNull(),
	status: varchar('status', { length: 50 }).notNull(),
	fileLink: text('file_link'),
	deskripsiSingkat: text('deskripsi_singkat')
});

export const jenisDokumen = mysqlTable('jenis_dokumen', {
	id: int('id').autoincrement().primaryKey(),
	kode: varchar('kode', { length: 50 }).notNull(),
	nama: text('nama').notNull()
});

export const transaksi = mysqlTable('transaksi', {
	id: int('id').autoincrement().primaryKey(),
	tanggal: timestamp('tanggal').defaultNow().notNull(),
	keterangan: text('keterangan').notNull(),
	tipe: varchar('tipe', { length: 10 }).notNull(), // 'masuk' atau 'keluar'
	nominal: int('nominal').notNull()
});
