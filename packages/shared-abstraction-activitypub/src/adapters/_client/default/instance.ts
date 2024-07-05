import {
	InstanceApi_CustomEmojiDTO,
	InstanceRoute,
	KNOWN_SOFTWARE,
} from '../_router/instance';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types';
import { getSoftwareInfoShared } from '../_router/shared';
import {
	DhaagaMastoClient,
	DhaagaMisskeyClient,
	MastoErrorHandler,
} from '../_router/_runner';

export class DefaultInstanceRouter implements InstanceRoute {
	/**
	 * For default client, we must
	 * determine the instance on owr own
	 * @param urlLike
	 */
	async getCustomEmojis(
		urlLike: string,
	): Promise<LibraryResponse<InstanceApi_CustomEmojiDTO[]>> {
		const { data, error } = await this.getSoftwareInfo(urlLike);
		if (error || !data) return { error };

		switch (data.software) {
			case KNOWN_SOFTWARE.MASTODON: {
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
			default: {
				return {
					data: [],
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
