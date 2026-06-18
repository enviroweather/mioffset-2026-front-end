import { fail, redirect } from '@sveltejs/kit';
import { ACCESS_PASSPHRASE, MI_OFFSET_PASSPHRASE_ENABLED } from '$env/static/private';
import { createHash } from 'crypto';

function passphraseHash(passphrase) {
	return createHash('sha256').update(passphrase).digest('hex');
}

export const actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const passphrase = data.get('passphrase')?.toString().trim() ?? '';

		if (passphrase !== ACCESS_PASSPHRASE) {
			return fail(403, { incorrect: true });
		}

		cookies.set('access_token', passphraseHash(ACCESS_PASSPHRASE), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		const returnTo = url.searchParams.get('returnTo') ?? '/';
		throw redirect(302, returnTo.startsWith('/') ? returnTo : '/');
	}
};
