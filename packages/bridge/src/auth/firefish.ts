import { generateMiAuthUrl } from '#/auth/mi-auth.js';

/**
 * @deprecated @dhaaga/bridge no longer supports
 * firefish auth. this implementation is an
 * archive.
 */
function generateLoginUrl(
	urlLike: string,
	{
		appName,
		appWebsite,
		appCallback,
	}: { appName: string; appWebsite: string; appCallback: string },
) {
	const FIREFISH_PERMS = [
		'read:account',
		'write:account',
		'read:blocks',
		'write:blocks',
		'read:drive',
		'write:drive',
		'read:favorites',
		'write:favorites',
		'read:following',
		'write:following',
		'read:mutes',
		'write:mutes',
		'write:notes',
		'read:notifications',
		'write:notifications',
		'read:reactions',
		'write:reactions',
		'write:votes',
	];

	return generateMiAuthUrl({
		urlLike,
		appName,
		appCallback,
		// perms: FIREFISH_PERMS,
	});
}
