import { InstanceRoute } from './_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import {
	MastoAccountCredentials,
	MastoTranslation,
} from '#/types/mastojs.types.js';
import { ApiErrorCode } from '#/types/result.types.js';
import {
	MastoJsWrapper,
	MegalodonGoToSocialWrapper,
	MisskeyJsWrapper,
} from '#/client/utils/api-wrappers.js';
import { KNOWN_SOFTWARE } from '#/client/utils/driver.js';
import { identifyBackendSoftware } from '#/client/utils/detect-software.js';
import { errorBuilder, LibraryPromise } from '#/types/index.js';
import { CustomEmojiObjectType } from '#/types/shared/reactions.js';

type WelKnownNodeinfo = {
	links: {
		href: string;
		rel: string;
	}[];
};

const NODEINFO_10 = 'http://nodeinfo.diaspora.software/ns/schema/1.0';
const NODEINFO_20 = 'http://nodeinfo.diaspora.software/ns/schema/2.0';
const NODEINFO_21 = 'http://nodeinfo.diaspora.software/ns/schema/2.1';

export class DefaultInstanceRouter implements InstanceRoute {
	/**
	 * For the default client, we must
	 * determine the instance on owr own
	 * @param urlLike
	 * @param software
	 */
	async getCustomEmojis(
		urlLike: string,
		software?: string,
	): Promise<CustomEmojiObjectType[]> {
		if (!software) {
			const data = await this.getSoftwareInfo(urlLike);
			software = data.software;
		}

		switch (software) {
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.ICESHRIMP:
			case KNOWN_SOFTWARE.MASTODON:
			case KNOWN_SOFTWARE.KMYBLUE: {
				const rex =
					await MastoJsWrapper.create(urlLike).lib.v1.customEmojis.list();
				return (
					rex?.map((o) => ({
						shortCode: o.shortcode,
						url: o.url,
						staticUrl: o.staticUrl,
						visibleInPicker: o.visibleInPicker,
						category: o.category,
						aliases: [],
						tags: [],
					})) ?? []
				);
			}
			case KNOWN_SOFTWARE.SHARKEY:
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.CHERRYPICK: {
				const emojiFn = await MisskeyJsWrapper.create(urlLike).client.request(
					'emojis',
					{},
				);
				return emojiFn.emojis.map((o: any) => ({
					shortCode: o.name,
					url: o.url,
					staticUrl: o.url,
					visibleInPicker: true,
					category: o.category,
					aliases: o.aliases,
					tags: [],
				}));
			}
			case KNOWN_SOFTWARE.PLEROMA:
			case KNOWN_SOFTWARE.AKKOMA: {
				// NOTE: Megalodon payload seems deprecated
				const data = await new FetchWrapper(urlLike).get<any[]>(
					'/api/v1/custom_emojis',
				);
				return data.map((o) => ({
					shortCode: o.shortcode,
					url: o.url,
					staticUrl: o.static_url,
					visibleInPicker: o.visible_in_picker,
					aliases: [],
					category: o.category,
					tags: (o as any).tags || [],
				}));
			}
			case KNOWN_SOFTWARE.GOTOSOCIAL: {
				const dt =
					await MegalodonGoToSocialWrapper.create(
						urlLike,
					).client.getInstanceCustomEmojis();
				return dt.data.map((o) => ({
					shortCode: o.shortcode,
					url: o.url,
					staticUrl: o.static_url,
					visibleInPicker: o.visible_in_picker,
					aliases: [],
					category: o.category,
					tags: [],
				}));
			}
			default: {
				throw new Error(`backend software incompatible for ${urlLike}`);
			}
		}
	}

	async getNodeInfo(urlLike: string): LibraryPromise<string> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		try {
			if (urlLike.startsWith('http://') || urlLike.startsWith('https://')) {
			} else {
				urlLike = 'https://' + urlLike;
			}

			const response = await fetch(urlLike + '/.well-known/nodeinfo', {
				signal: controller.signal,
			});
			if (!response.ok) return errorBuilder(response.statusText);

			const res = await response.json();

			const nodeType = (res as WelKnownNodeinfo).links.find((l) =>
				[NODEINFO_21, NODEINFO_20, NODEINFO_10].includes(l.rel),
			);

			if (!nodeType) return errorBuilder<string>(ApiErrorCode.UNKNOWN_ERROR);
			return { data: nodeType.href };
		} catch (e) {
			return errorBuilder<string>(ApiErrorCode.UNKNOWN_ERROR);
		} finally {
			clearTimeout(timeoutId); // Clear the timeout
		}
	}

	private static getVersion(text: string) {
		const ex = /^([0-9]+.[0-9]+.[0-9]+)/;
		if (ex.test(text)) {
			return ex.exec(text)![1];
		}
		return null;
	}

	/**
	 * Get the software and version this instance runs on
	 * @param nodeinfoUrl the diaspora nodeinfo url
	 */
	async getSoftware(nodeinfoUrl: string): LibraryPromise<{
		software: string;
		version: string | null;
	}> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		try {
			const response = await fetch(nodeinfoUrl, {
				signal: controller.signal,
			});
			if (!response.ok) return errorBuilder(response.statusText);
			const res = await response.json();
			return {
				data: {
					software: res?.software?.name,
					version: DefaultInstanceRouter.getVersion(res.version),
				},
			};
		} catch (e) {
			return errorBuilder<{
				software: string;
				version: string | null;
			}>(ApiErrorCode.UNKNOWN_ERROR);
		} finally {
			clearTimeout(timeoutId); // Clear the timeout
		}
	}

	async getSoftwareInfo(urlLike: string) {
		return identifyBackendSoftware(urlLike);
	}

	async getTranslation(id: string, lang: string): Promise<MastoTranslation> {
		throw new Error('Method not implemented.');
	}

	/**
	 * Exchange temp code token
	 * with permanent token
	 * @param instanceUrl
	 * @param code
	 * @param clientId
	 * @param clientSecret
	 */
	async getMastodonAccessToken(
		instanceUrl: string,
		code: string,
		clientId: string,
		clientSecret: string,
	) {
		try {
			const res = await fetch(`https://${instanceUrl}/oauth/token`, {
				method: 'POST',
				body: JSON.stringify({
					client_id: clientId,
					client_secret: clientSecret,
					redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
					grant_type: 'authorization_code',
					code,
					scope: 'read write push follow',
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!res.ok) {
				return null;
			}
			const data = await res.json();
			return data?.access_token;
		} catch (e) {
			console.log('[ERROR]: obtaining mastodon token', e);
			return null;
		}
	}

	/**
	 * Verify a Mastodon API token
	 * @param urlLike
	 * @param token
	 */
	async verifyCredentials(
		urlLike: string,
		token: string,
	): LibraryPromise<MastoAccountCredentials> {
		const res = await fetch(
			`https://${urlLike}/api/v1/accounts/verify_credentials`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			},
		);
		if (!res.ok) return errorBuilder(res.statusText);
		return { data: await res.json() };
	}
}
