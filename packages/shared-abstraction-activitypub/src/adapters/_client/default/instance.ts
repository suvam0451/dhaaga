import {
	InstanceApi_CustomEmojiDTO,
	InstanceRoute,
	KNOWN_SOFTWARE,
} from '../_router/instance.js';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import { getSoftwareInfoShared } from '../_router/shared.js';
import {
	DhaagaMastoClient,
	DhaagaMegalodonClient,
	DhaagaMisskeyClient,
	MastoErrorHandler,
} from '../_router/_runner.js';
import { LibraryPromise } from '../_router/routes/_types.js';

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
			callback: appCallback,
			// 'write:notes,write:following,read:drive'
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
	 */
	async getLoginUrl(
		urlLike: string,
		{
			uuid,
			appName,
			appCallback,
		}: {
			appName: string;
			appCallback: string;
			uuid: string;
		},
	): LibraryPromise<{
		software: string;
		version?: string | null;
		loginUrl: string;
		loginStrategy: 'code' | 'miauth';
	}> {
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
			case KNOWN_SOFTWARE.MASTODON: {
				return {
					data: {
						loginUrl: '',
						loginStrategy: 'code',
						version: data.version,
						software: data.software,
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
			case KNOWN_SOFTWARE.MASTODON:
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.ICESHRIMP:
			case KNOWN_SOFTWARE.KMYBLUE:
			case KNOWN_SOFTWARE.SHARKEY: {
				const emojiFn = DhaagaMastoClient(urlLike).client.v1.customEmojis.list;
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
				}));
				return {
					data: mapped,
				};
			}
			case KNOWN_SOFTWARE.MISSKEY: {
				const emojiFn = await DhaagaMisskeyClient(urlLike).client.request(
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
					})),
				};
			}
			case KNOWN_SOFTWARE.PLEROMA:
			case KNOWN_SOFTWARE.AKKOMA: {
				try {
					const dt = await DhaagaMegalodonClient(
						KNOWN_SOFTWARE.PLEROMA,
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
						})),
					};
				} catch (e: any) {
					if (e?.response?.status && e?.response?.statusText) {
						if (e?.response?.status === 401) {
							return {
								error: {
									code: DhaagaErrorCode.UNAUTHORIZED,
									message: e?.response?.statusText,
								},
							};
						}
					}
					return {
						error: {
							code: DhaagaErrorCode.UNKNOWN_ERROR,
							message: e,
						},
					};
				}
			}
			case KNOWN_SOFTWARE.GOTOSOCIAL: {
				try {
					const dt = await DhaagaMegalodonClient(
						KNOWN_SOFTWARE.GOTOSOCIAL,
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
						})),
					};
				} catch (e: any) {
					if (e?.response?.status && e?.response?.statusText) {
						if (e?.response?.status === 401) {
							return {
								error: {
									code: DhaagaErrorCode.UNAUTHORIZED,
									message: e?.response?.statusText,
								},
							};
						}
					}
					return {
						error: {
							code: DhaagaErrorCode.UNKNOWN_ERROR,
							message: e,
						},
					};
				}

				return { data: [] };
			}
			default: {
				return {
					error: {
						code: DhaagaErrorCode.SOFTWARE_UNSUPPORTED_BY_LIBRARY,
						message: software,
					},
				};
			}
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
				code: DhaagaErrorCode.DEFAULT_CLIENT,
			},
		};
	}
}
