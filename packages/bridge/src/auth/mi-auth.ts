import { UserDetailed } from 'misskey-js/entities.js';
import { RandomUtil } from '#/utils/index.js';

type MiauthSessionCheckResponse =
	| { ok: false }
	| {
			ok: true;
			token: string;
			user: UserDetailed;
	  };

export const verifyMisskeyToken = async (host: string, session: string) => {
	const res = await fetch(`${host}/api/miauth/${session}/check`, {
		method: 'POST',
		headers: {
			// 'Content-Type': 'application/json',
		},
	});

	// If the API returns JSON, parse it:
	if (!res.ok) {
		throw new Error(`Request failed: ${res.status} ${res.statusText}`);
	}

	const data = await res.json(); // typed as MiauthSessionCheckResponse if you cast it
	return data as MiauthSessionCheckResponse;
};

const MISSKEY_PERMS = [
	'write:user-groups',
	'read:user-groups',
	'read:page-likes',
	'write:page-likes',
	'write:pages',
	'read:pages',
	'write:votes',
	'write:reactions',
	'read:reactions',
	'write:notifications',
	'read:notifications',
	'write:notes',
	'write:mutes',
	'read:mutes',
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
	'read:messaging',
	'write:messaging',
];
const MISSKEY_PERMS_POST_V12_47_0 = ['read:channels', 'write:channels'];
const MISSKEY_PERMS_POST_V12_75_0 = [
	'read:gallery',
	'write:gallery',
	'read:gallery-likes',
	'write:gallery-likes',
];

/**
 *
 *
 * @param urlLike
 * @param uuid
 * @param appName
 * @param appCallback for example, https://suvam.io/dhaaga/mi-auth
 * make sure you own the domain and the users know about it
 * @param perms
 */
export function generateMiAuthUrl({
	urlLike,
	appName,
	appCallback,
}: {
	urlLike: string;
	appName: string;
	appCallback: string;
}) {
	const uuid = RandomUtil.nanoId();
	const authEndpoint = `https://${urlLike}/miauth/${uuid}`;
	const perms = [
		...MISSKEY_PERMS,
		...MISSKEY_PERMS_POST_V12_75_0,
		...MISSKEY_PERMS_POST_V12_47_0,
	];

	// Set up parameters for the query string
	const options: Record<string, string> = {
		name: appName,
		callback: appCallback, // https://example.com --> https://suvam.io
		permission: perms.join(','),
	};

	// Generate the query string
	const queryString = Object.keys(options)
		.map((key) => `${key}=${encodeURIComponent(options[key])}`)
		.join('&');

	return `${authEndpoint}?${queryString}`;
}
