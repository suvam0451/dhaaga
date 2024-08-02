import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { LibraryResponse } from '../_router/_types.js';
import {
	MastoScheduledStatus,
	MastoStatus,
	MegaReaction,
} from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/instance.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class PleromaStatusesRouter implements StatusesRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MEGALODON>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMegalodonClient(
			KNOWN_SOFTWARE.PLEROMA,
			this.client.url,
			this.client.accessToken,
		);
	}

	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		return notImplementedErrorBuilder();
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MastoScheduledStatus> {
		return notImplementedErrorBuilder<MastoScheduledStatus>();
	}

	/**
	 * Pleroma specific stuff
	 */

	async getReactions(id: string): Promise<LibraryResponse<MegaReaction[]>> {
		const data = await this.lib.client.getEmojiReactions(id);
		return { data: data.data };
	}

	async bookmark(id: string) {
		const data = await this.lib.client.bookmarkStatus(id);
		return { data: data.data };
	}

	async unBookmark(id: string) {
		const data = await this.lib.client.unbookmarkStatus(id);
		return { data: data.data };
	}

	async getContext(id: string) {
		const data = await this.lib.client.getStatusContext(id);
		return { data: data.data };
	}
}
