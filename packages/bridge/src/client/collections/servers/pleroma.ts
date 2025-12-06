import { InstanceRoute } from './_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/client/utils/api-wrappers.js';
import { CustomEmojiObject } from '#/types/shared/reactions.js';

export class PleromaInstanceRouter implements InstanceRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async getTranslation(id: string, lang: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	async getCustomEmojis(urlLike: string): Promise<CustomEmojiObject[]> {
		const data =
			await MegalodonPleromaWrapper.create(
				urlLike,
			).client.getInstanceCustomEmojis();

		return data.data.map((o) => ({
			shortCode: o.shortcode,
			url: o.url,
			staticUrl: o.static_url,
			visibleInPicker: o.visible_in_picker,
			category: o.category,
			aliases: [],
			tags: [],
		}));
	}
}
