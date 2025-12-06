import { InstanceRoute } from './_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { CustomEmojiObject } from '#/types/shared/reactions.js';
import { MastoTranslation } from '#/types/index.js';

export class MastodonInstanceRouter implements InstanceRoute {
	direct: FetchWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
	}

	async getCustomEmojis(urlLike: string): Promise<CustomEmojiObject[]> {
		const data =
			await MastoJsWrapper.create(urlLike).lib.v1.customEmojis.list();
		return (
			data?.map((o: any) => ({
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

	async getTranslation(id: string, lang: string): Promise<MastoTranslation> {
		const _client = MastoJsWrapper.create(
			this.direct.baseUrl,
			this.direct.token,
		);
		return _client.lib.v1.statuses.$select(id).translate({ lang: 'en' });
	}
}
