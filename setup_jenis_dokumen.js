import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
    // Seed the database with the initial types
    const documentTypes = [
		{ kode: 'SPK', nama: 'Surat Perjanjian Kerjasama' },
		{ kode: 'BAST', nama: 'Berita Acara Serah Terima' },
		{ kode: 'INV', nama: 'Invoice / Tagihan' },
		{ kode: 'SUR', nama: 'Surat Undangan' },
		{ kode: 'NOT', nama: 'Notulensi / MoM' },
		{ kode: 'LAP', nama: 'Laporan Progress' },
		{ kode: 'NDA', nama: 'Non-Disclosure Agreement' },
		{ kode: 'ADD', nama: 'Adendum / Revisi Kontrak' },
		{ kode: 'INT', nama: 'Surat Internal' }
	];
    for (const doc of documentTypes) {
        await connection.execute('INSERT INTO jenis_dokumen (kode, nama) VALUES (?, ?)', [doc.kode, doc.nama]);
    }
    console.log('Seed data inserted');
} catch (e) {
    console.error(e);
}
await connection.end();
