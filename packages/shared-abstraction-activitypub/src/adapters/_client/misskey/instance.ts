import {
	InstanceApi_CustomEmojiDTO,
	InstanceRoute,
} from '../_router/routes/instance.js';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import type { mastodon } from 'masto';
import { getSoftwareInfoShared } from '../_router/shared.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class MisskeyInstanceRouter implements InstanceRoute {
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
				code: DhaagaErrorCode.FEATURE_UNSUPPORTED,
			},
		};
	}
}
