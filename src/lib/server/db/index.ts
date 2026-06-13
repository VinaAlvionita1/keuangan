import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });