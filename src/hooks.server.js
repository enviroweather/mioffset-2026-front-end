import { redirect } from '@sveltejs/kit';
import { ACCESS_PASSPHRASE, MI_OFFSET_PASSPHRASE_ENABLED } from '$env/static/private';
import { createHash } from 'crypto';

function passphraseHash(passphrase) {
	return createHash('sha256').update(passphrase).digest('hex');
}

export async function handle({ event, resolve }) {
	if (event.url.pathname !== '/passphrase' && MI_OFFSET_PASSPHRASE_ENABLED == 1) {
		const token = event.cookies.get('access_token');
		// the user is not authorized, redirect to passphrase screen
		if (token !== passphraseHash(ACCESS_PASSPHRASE)) {
			throw redirect(302, '/passphrase');
		}
	}
	return resolve(event);
}
