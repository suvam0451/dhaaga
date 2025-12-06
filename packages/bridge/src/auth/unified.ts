import { identifyBackendSoftware } from '#/client/utils/detect-software.js';
import { KNOWN_SOFTWARE } from '#/client/utils/driver.js';
import { generateMiAuthUrl } from '#/auth/mi-auth.js';
import { generateActivitypubLoginUrl } from '#/auth/activitypub.js';

/**
 * Automatically detects backend software
 * and generates the login url and recommended
 * strategy for it.
 *
 * you should copy the code and implement
 * your own auth, if and when:
 *
 * 1) use different auth gates for
 * Bluesky/Misskey/Mastodon/etc.
 *
 * 2) And, do not care about identifying and
 * storing the backend software used by the instance
 *
 * @param urlLike instance url
 * @param appName
 * @param appWebsite
 * @param appCallback
 * @param tokens are required to be saved for Mastodon.
 * Ignore for mi-auth
 */
export async function generateDhaagaAuthStrategy(
	urlLike: string,
	{
		appName,
		appWebsite,
		appCallback,
	}: { appName: string; appWebsite: string; appCallback: string },
	tokens?: {
		clientId: string;
		clientSecret: string;
	},
): Promise<{
	software: string;
	version?: string | null;
	loginUrl: string;
	loginStrategy: 'code' | 'miauth';
	clientId?: string;
	clientSecret?: string;
}> {
	const data = await identifyBackendSoftware(urlLike);
	switch (data.software) {
		case KNOWN_SOFTWARE.FIREFISH: {
			throw new Error('firefish is no longer supported by @dhaaga/bridge');
		}
		case KNOWN_SOFTWARE.SHARKEY:
		case KNOWN_SOFTWARE.MEISSKEY:
		case KNOWN_SOFTWARE.CHERRYPICK:
		case KNOWN_SOFTWARE.KMYBLUE:
		case KNOWN_SOFTWARE.ICESHRIMP:
		case KNOWN_SOFTWARE.MISSKEY: {
			return {
				loginUrl: generateMiAuthUrl({
					urlLike,
					appName,
					appCallback,
				}),
				loginStrategy: 'miauth',
				version: data.version,
				software: data.software,
			};
		}
		case KNOWN_SOFTWARE.PLEROMA:
		case KNOWN_SOFTWARE.AKKOMA:
		case KNOWN_SOFTWARE.MASTODON: {
			const { loginUrl, clientSecret, clientId } =
				await generateActivitypubLoginUrl(
					urlLike,
					{
						appName,
						appWebsite,
					},
					{
						appId: tokens?.clientId,
						appSecret: tokens?.clientSecret,
					},
				);

			return {
				loginUrl,
				loginStrategy: 'code',
				version: data.version,
				software: data.software,
				clientId,
				clientSecret,
			};
		}
		default:
			throw new Error(`backend software incompatible for ${urlLike}`);
	}
}
