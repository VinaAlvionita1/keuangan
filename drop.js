import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
await connection.execute('DROP TABLE IF EXISTS letters');
await connection.execute('DROP TABLE IF EXISTS surat_masuk');
console.log('Tables dropped');
await connection.end();
