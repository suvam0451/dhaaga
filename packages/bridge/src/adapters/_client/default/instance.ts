import {
	InstanceApi_CustomEmojiDTO,
	InstanceRoute,
} from '../_router/routes/instance.js';
import { getSoftwareInfoShared } from '../_router/shared.js';
import { MastoErrorHandler } from '../_router/_runner.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MastoAccountCredentials } from '../../../types/mastojs.types.js';
import { ApiErrorCode, LibraryResponse } from '../../../types/result.types.js';
import {
	MastoJsWrapper,
	MegalodonGoToSocialWrapper,
	MisskeyJsWrapper,
} from '../../../custom-clients/custom-clients.js';
import { KNOWN_SOFTWARE } from '../../../data/driver.js';

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
	private misskeyAuthUrl({
		urlLike,
		uuid,
		appName,
		appCallback,
		perms,
	}: {
		urlLike: string;
		uuid: string;
		perms: string[];
		appName: string;
		appCallback: string;
	}) {
		const authEndpoint = `https://${urlLike}/miauth/${uuid}`;

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

	/**
	 *
	 * @param urlLike
	 * @param uuid
	 * @param appName
	 * @param appCallback
	 * @param appClientId
	 * @param appClientSecret
	 */
	async getLoginUrl(
		urlLike: string,
		{
			uuid,
			appName,
			appCallback,
			appClientId,
			appClientSecret,
		}: {
			appName: string;
			appCallback: string;
			appClientId?: string;
			uuid: string;
			appClientSecret?: string;
		},
	): LibraryPromise<{
		software: string;
		version?: string | null;
		loginUrl: string;
		loginStrategy: 'code' | 'miauth';
		clientId?: string;
		clientSecret?: string;
	}> {
		let _appClientId = appClientId;
		let _appClientSecret = appClientSecret;

		const { data, error } = await this.getSoftwareInfo(urlLike);
		if (error) return { error };

		switch (data.software) {
			case KNOWN_SOFTWARE.FIREFISH: {
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

				return {
					data: {
						loginUrl: this.misskeyAuthUrl({
							urlLike,
							uuid,
							appName,
							appCallback,
							perms: FIREFISH_PERMS,
						}),
						loginStrategy: 'miauth',
						version: data.version,
						software: data.software,
					},
				};
			}
			case KNOWN_SOFTWARE.SHARKEY:
			case KNOWN_SOFTWARE.MEISSKEY:
			case KNOWN_SOFTWARE.CHERRYPICK:
			case KNOWN_SOFTWARE.KMYBLUE:
			case KNOWN_SOFTWARE.ICESHRIMP:
			case KNOWN_SOFTWARE.MISSKEY: {
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

				return {
					data: {
						loginUrl: this.misskeyAuthUrl({
							urlLike,
							uuid,
							appName,
							appCallback,
							perms: [
								...MISSKEY_PERMS,
								...MISSKEY_PERMS_POST_V12_75_0,
								...MISSKEY_PERMS_POST_V12_47_0,
							],
						}),
						loginStrategy: 'miauth',
						version: data.version,
						software: data.software,
					},
				};
			}

			case KNOWN_SOFTWARE.PLEROMA:
			case KNOWN_SOFTWARE.AKKOMA:
			case KNOWN_SOFTWARE.MASTODON: {
				if (!_appClientId || !_appClientSecret) {
					const clientIdFormData: Record<string, string> = {
						client_name: 'Dhaaga',
						redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
						scopes: 'read write follow push',
						website: 'https://suvam.io/dhaaga',
					};

					// Generate the query string
					const clientIdQueryString = Object.keys(clientIdFormData)
						.map((key) => `${key}=${encodeURIComponent(clientIdFormData[key])}`)
						.join('&');

					const clientId = await fetch(`https://${urlLike}/api/v1/apps`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: clientIdQueryString,
					});
					if (!clientId.ok) {
						console.log('no ok');
					}
					const _body = await clientId.json();
					_appClientId = _body?.['client_id'];
					_appClientSecret = _body?.['client_secret'];
				}
				const authEndpoint = `https://${urlLike}/oauth/authorize`;

				// Set up parameters for the query string
				const options: Record<string, string> = {
					client_id: _appClientId!,
					redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
					response_type: 'code',
					scope: 'read write follow push',
				};
				// Generate the query string
				const queryString = Object.keys(options)
					.map((key) => `${key}=${encodeURIComponent(options[key])}`)
					.join('&');

				return {
					data: {
						loginUrl: `${authEndpoint}?${queryString}`,
						loginStrategy: 'code',
						version: data.version,
						software: data.software,
						clientId: _appClientId,
						clientSecret: _appClientSecret,
					},
				};
			}
			default: {
				return {
					data: {
						loginUrl: '',
						loginStrategy: 'code',
						version: data.version,
						software: data.software,
					},
				};
			}
		}
	}

	/**
	 * For default client, we must
	 * determine the instance on owr own
	 * @param urlLike
	 * @param software
	 */
	async getCustomEmojis(
		urlLike: string,
		software?: string,
	): Promise<LibraryResponse<InstanceApi_CustomEmojiDTO[]>> {
		if (!software) {
			const { data, error } = await this.getSoftwareInfo(urlLike);
			if (error || !data) return { error };
			software = data.software;
		}

		switch (software) {
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.ICESHRIMP:
			case KNOWN_SOFTWARE.MASTODON:
			case KNOWN_SOFTWARE.KMYBLUE: {
				const emojiFn = MastoJsWrapper.create(urlLike).lib.v1.customEmojis.list;
				const { data, error } = await MastoErrorHandler(emojiFn);
				if (error) return { error };
				const rex = await data;
				const mapped: InstanceApi_CustomEmojiDTO[] = rex!.map((o) => ({
					shortCode: o.shortcode,
					url: o.url,
					staticUrl: o.staticUrl,
					visibleInPicker: o.visibleInPicker,
					category: o.category,
					aliases: [],
					tags: [],
				}));
				return {
					data: mapped,
				};
			}
			case KNOWN_SOFTWARE.SHARKEY:
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.CHERRYPICK: {
				const emojiFn = await MisskeyJsWrapper.create(urlLike).client.request(
					'emojis',
					{},
				);
				return {
					data: emojiFn.emojis.map((o: any) => ({
						shortCode: o.name,
						url: o.url,
						staticUrl: o.url,
						visibleInPicker: true,
						category: o.category,
						aliases: o.aliases,
						tags: [],
					})),
				};
			}
			case KNOWN_SOFTWARE.PLEROMA:
			case KNOWN_SOFTWARE.AKKOMA: {
				try {
					// NOTE: Megalodon payload seems deprecated
					const { data, error } = await new FetchWrapper(urlLike).get<any[]>(
						'/api/v1/custom_emojis',
					);
					if (error) {
						console.log('[WARN]: error fetching emojis', error);
						return { data: [] };
					}
					return {
						data: data.map((o) => ({
							shortCode: o.shortcode,
							url: o.url,
							staticUrl: o.static_url,
							visibleInPicker: o.visible_in_picker,
							aliases: [],
							category: o.category,
							tags: (o as any).tags || [],
						})),
					};
				} catch (e: any) {
					if (e?.response?.status && e?.response?.statusText) {
						if (e?.response?.status === 401) {
							return {
								error: {
									code: ApiErrorCode.UNAUTHORIZED,
									message: e?.response?.statusText,
								},
							};
						}
					}
					return {
						error: {
							code: ApiErrorCode.UNKNOWN_ERROR,
							message: e,
						},
					};
				}
			}
			case KNOWN_SOFTWARE.GOTOSOCIAL: {
				try {
					const dt =
						await MegalodonGoToSocialWrapper.create(
							urlLike,
						).client.getInstanceCustomEmojis();
					return {
						data: dt.data.map((o) => ({
							shortCode: o.shortcode,
							url: o.url,
							staticUrl: o.static_url,
							visibleInPicker: o.visible_in_picker,
							aliases: [],
							category: o.category,
							tags: [],
						})),
					};
				} catch (e: any) {
					if (e?.response?.status && e?.response?.statusText) {
						if (e?.response?.status === 401) {
							return {
								error: {
									code: ApiErrorCode.UNAUTHORIZED,
									message: e?.response?.statusText,
								},
							};
						}
					}
					return {
						error: {
							code: ApiErrorCode.UNKNOWN_ERROR,
							message: e,
						},
					};
				}
			}
			default: {
				return {
					error: {
						code: ApiErrorCode.FEATURE_UNSUPPORTED,
						message: software,
					},
				};
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
		const { data, error } = await getSoftwareInfoShared(urlLike);
		if (error) return { error };
		return { data };
	}

	async getTranslation(id: string, lang: string) {
		return {
			error: {
				code: ApiErrorCode.DEFAULT_CLIENT,
			},
		};
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
