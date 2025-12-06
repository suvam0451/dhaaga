import { InstanceApi_CustomEmojiDTO, InstanceRoute } from './_interface.js';
import type { mastodon } from 'masto';
import { getSoftwareInfoShared } from '#/adapters/_client/_router/shared.js';
import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import { ApiErrorCode, LibraryResponse } from '#/types/result.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MisskeyJsWrapper } from '#/client/utils/custom-clients.js';

export class MisskeyInstanceRouter implements InstanceRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
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

	getCustomEmojis(
		urlLike: string,
	): Promise<LibraryResponse<InstanceApi_CustomEmojiDTO[]>> {
		throw new Error('Method not implemented.');
	}

	async getSoftwareInfo(urlLike: string) {
		return await getSoftwareInfoShared(urlLike);
	}

	async getTranslation(
		id: string,
		lang: string,
	): Promise<LibraryResponse<mastodon.v1.Translation>> {
		return {
			error: {
				code: ApiErrorCode.FEATURE_UNSUPPORTED,
			},
		};
	}
}
