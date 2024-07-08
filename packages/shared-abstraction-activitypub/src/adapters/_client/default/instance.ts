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

export class DefaultInstanceRouter implements InstanceRoute {
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
			case KNOWN_SOFTWARE.PLEROMA:
			case KNOWN_SOFTWARE.AKKOMA:
			case KNOWN_SOFTWARE.MASTODON:
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.ICESHRIMP:
			case KNOWN_SOFTWARE.KMYBLUE: {
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
