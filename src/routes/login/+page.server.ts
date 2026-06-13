import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { createSession, hashPassword, verifyPassword } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  // If already logged in, redirect to homepage
  if (locals.user) {
    throw redirect(303, '/');
  }

  // Check if there are any users in the system
  const allUsers = await db.select().from(users).limit(1);
  const firstTimeSetup = allUsers.length === 0;

  return {
    firstTimeSetup
  };
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString()?.trim();
    const password = data.get('password')?.toString();

    if (!username || !password) {
      return fail(400, { missing: true, message: 'Username dan Password wajib diisi' });
    }

    // Check user in database
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (result.length === 0) {
      return fail(400, { invalid: true, message: 'Username atau Password salah' });
    }

    const user = result[0];

    // Verify password
    const valid = verifyPassword(password, user.passwordHash);
    if (!valid) {
      return fail(400, { invalid: true, message: 'Username atau Password salah' });
    }

    // Create session
    const sessionId = await createSession(user.id);

    // Set cookie
    cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    throw redirect(303, '/');
  },

  register: async ({ request, cookies }) => {
    // Only allow registration if no users exist in the database
    const allUsers = await db.select().from(users).limit(1);
    if (allUsers.length > 0) {
      return fail(400, { forbidden: true, message: 'Registrasi administrator tambahan dinonaktifkan untuk keamanan.' });
    }

    const data = await request.formData();
    const username = data.get('username')?.toString()?.trim();
    const password = data.get('password')?.toString();
    const nama = data.get('nama')?.toString()?.trim();

    if (!username || !password || !nama) {
      return fail(400, { missing: true, message: 'Semua kolom (Nama, Username, Password) wajib diisi' });
    }

    if (password.length < 6) {
      return fail(400, { invalid: true, message: 'Password minimal terdiri dari 6 karakter' });
    }

    // Create new user
    const passwordHash = hashPassword(password);

    await db.insert(users).values({
      username,
      passwordHash,
      nama,
      role: 'admin'
    });

    // Get the created user id
    // For MySQL with drizzle, we can select the user back or use autoincrement ID from insertResult
    const createdUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (createdUser.length === 0) {
      return fail(500, { error: true, message: 'Gagal membuat akun administrator' });
    }

    // Create session
    const sessionId = await createSession(createdUser[0].id);

    // Set cookie
    cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    throw redirect(303, '/');
  }
};
