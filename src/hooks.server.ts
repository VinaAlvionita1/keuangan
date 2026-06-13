import { redirect, type Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');

	if (sessionId) {
		const sessionData = await validateSession(sessionId);
		if (sessionData) {
			event.locals.user = {
				id: sessionData.user.id,
				username: sessionData.user.username,
				nama: sessionData.user.nama,
				role: sessionData.user.role
			};
		} else {
			event.cookies.delete('session_id', { path: '/' });
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	const path = event.url.pathname;

	// Protect pages: /surat and /keuangan
	if ((path.startsWith('/surat') || path.startsWith('/keuangan')) && !event.locals.user) {
		throw redirect(303, '/login');
	}

	// Redirect authenticated users trying to access login page
	if (path === '/login' && event.locals.user) {
		throw redirect(303, '/');
	}

	return resolve(event);
};
