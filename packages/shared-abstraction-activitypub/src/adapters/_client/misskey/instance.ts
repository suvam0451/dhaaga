import { InstanceApi_CustomEmojiDTO, InstanceRoute } from '../_router/instance';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types';
import type { mastodon } from 'masto';
import { getSoftwareInfoShared } from '../_router/shared';

export class MisskeyInstanceRouter implements InstanceRoute {
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
				code: DhaagaErrorCode.SOFTWARE_UNSUPPORTED_BY_LIBRARY,
			},
		};
	}
}
