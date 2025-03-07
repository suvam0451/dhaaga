import {
	InstanceApi_CustomEmojiDTO,
	InstanceRoute,
	MastoTranslation,
} from '../_router/routes/instance.js';
import { getSoftwareInfoShared } from '../_router/shared.js';
import { MastoErrorHandler } from '../_router/_runner.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { ApiErrorCode, LibraryResponse } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MastodonInstanceRouter implements InstanceRoute {
	direct: FetchWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
	}

	getLoginUrl(
		urlLike: string,
		{}: { appName: string; appCallback: string; uuid: string },
	): LibraryPromise<{
		software: string;
		version?: string | null | undefined;
		loginUrl: string;
		loginStrategy: 'code' | 'miauth';
	}> {
		throw new Error('Method not implemented.');
	}

	async getCustomEmojis(
		urlLike: string,
	): Promise<LibraryResponse<InstanceApi_CustomEmojiDTO[]>> {
		const fn = MastoJsWrapper.create(urlLike).lib.v1.customEmojis.list;
		const { data, error } = await MastoErrorHandler(fn);
		if (error) return { error };
		const x = await data;
		if (!x) return { error: { code: ApiErrorCode.UNKNOWN_ERROR } };
		return {
			data: x!.map((o: any) => ({
				shortCode: o.shortcode,
				url: o.url,
				staticUrl: o.staticUrl,
				visibleInPicker: o.visibleInPicker,
				category: o.category,
				aliases: [],
				tags: [],
			})),
			error,
		};
	}

	async getSoftwareInfo(urlLike: string) {
		return getSoftwareInfoShared(urlLike);
	}

	async getTranslation(
		id: string,
		lang: string,
	): Promise<LibraryResponse<MastoTranslation>> {
		const _client = MastoJsWrapper.create(
			this.direct.baseUrl,
			this.direct.token,
		);
		const data = await _client.lib.v1.statuses
			.$select(id)
			.translate({ lang: 'en' });
		return {
			data,
		};
	}
}
