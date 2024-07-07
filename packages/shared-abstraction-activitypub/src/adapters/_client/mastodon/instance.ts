import {
	InstanceApi_CustomEmojiDTO,
	InstanceRoute,
	MastoTranslation,
} from '../_router/instance.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { createRestAPIClient } from 'masto';
import { getSoftwareInfoShared } from '../_router/shared.js';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import { DhaagaMastoClient, MastoErrorHandler } from '../_router/_runner.js';

export class MastodonInstanceRouter implements InstanceRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	async getCustomEmojis(
		urlLike: string,
	): Promise<LibraryResponse<InstanceApi_CustomEmojiDTO[]>> {
		const fn = DhaagaMastoClient(urlLike).client.v1.customEmojis.list;
		const { data, error } = await MastoErrorHandler(fn);
		if (error) return { error };
		const x = await data;
		if (!x) return { error: { code: DhaagaErrorCode.UNKNOWN_ERROR } };
		return {
			data: x!.map((o: any) => ({
				shortCode: o.shortcode,
				url: o.url,
				staticUrl: o.staticUrl,
				visibleInPicker: o.visibleInPicker,
				category: o.category,
			})),
			error,
		};
	}

	private createMastoClient() {
		return createRestAPIClient({
			url: `https://${this.client.url}`,
			accessToken: this.client.accessToken,
		});
	}

	async getSoftwareInfo(urlLike: string) {
		return getSoftwareInfoShared(urlLike);
	}

	async getTranslation(
		id: string,
		lang: string,
	): Promise<LibraryResponse<MastoTranslation>> {
		const _client = this.createMastoClient();
		const data = await _client.v1.statuses
			.$select(id)
			.translate({ lang: 'en' });
		return {
			data,
		};
	}
}
