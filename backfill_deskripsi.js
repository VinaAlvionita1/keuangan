import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
    const defaultDesc = {
        'SPK': 'Kontrak proyek dengan klien',
        'BAST': 'Penyerahan produk/prototipe',
        'INV': 'Penagihan pembayaran termin',
        'SUR': 'Rapat, presentasi, UAT session',
        'NOT': 'Hasil rapat atau diskusi teknis',
        'LAP': 'Update bulanan ke klien/manajemen',
        'NDA': 'Kerahasiaan data proyek',
        'ADD': 'Perubahan scope/timeline/nilai',
        'INT': 'Komunikasi antar tim lab'
    };
    
    for (const [kode, deskripsi] of Object.entries(defaultDesc)) {
        await connection.execute('UPDATE jenis_dokumen SET deskripsi = ? WHERE kode = ?', [deskripsi, kode]);
    }
    console.log('Descriptions backfilled');
} catch (e) {
    console.error(e);
}
await connection.end();
