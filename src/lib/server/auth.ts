import { db } from '$lib/server/db';
import { users, sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';

// Password hashing
export function hashPassword(password: string): string {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
	const parts = storedHash.split(':');
	if (parts.length !== 2) return false;
	const [salt, originalHash] = parts;
	const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hash, 'hex'));
}

// Session management
export async function createSession(userId: number): Promise<string> {
	const sessionId = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

	await db.insert(sessions).values({
		id: sessionId,
		userId,
		expiresAt
	});

	return sessionId;
}

export async function validateSession(sessionId: string) {
	const result = await db
		.select({
			session: sessions,
			user: users
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId));

	if (result.length === 0) {
		return null;
	}

	const { session, user } = result[0];

	// Check if expired
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		return null;
	}

	// Extend session if it expires in less than 3 days
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 3) {
		const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
		await db.update(sessions).set({ expiresAt: newExpiresAt }).where(eq(sessions.id, sessionId));
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}
