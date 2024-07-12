import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { StatusesRoute } from '../_router/routes/statuses.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoStatus, MegaReaction } from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { DhaagaPleromaClient } from '../_router/_runner.js';

export class PleromaStatusesRouter implements StatusesRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		return notImplementedErrorBuilder();
	}

	/**
	 * Pleroma specific stuff
	 */

	async getReactions(id: string): Promise<LibraryResponse<MegaReaction[]>> {
		const x = DhaagaPleromaClient(
			this.client.url,
			this.client.accessToken,
		).client;
		const data = await x.getEmojiReactions(id);
		return { data: data.data };
	}
}
