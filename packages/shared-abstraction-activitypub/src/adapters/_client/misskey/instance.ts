import { InstanceRoute } from '../_router/instance';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types';
import type { mastodon } from 'masto';

export class MisskeyInstanceRouter implements InstanceRoute {
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
