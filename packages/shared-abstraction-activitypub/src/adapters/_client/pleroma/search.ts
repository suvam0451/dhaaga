import {
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from '../_router/routes/search.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { DhaagaErrorCode } from '../_router/_types.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MegaAccount, MegaStatus } from '../_interface.js';

export class PleromaSearchRouter implements SearchRoute {
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

	/**
	 * My instance is pretty slow on the FTS
	 *
	 * and I have not found any other search
	 * features in Pleroma/Akkoma
	 */
	async findUsers(query: DhaagaJsUserSearchDTO): LibraryPromise<MegaAccount[]> {
		try {
			const data = await this.lib.client.search(query.q || query.query, query);
			if (data.status !== 200) {
				return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
			}
			return { data: data.data.accounts };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async findPosts(query: DhaagaJsUserSearchDTO): LibraryPromise<MegaStatus[]> {
		try {
			const data = await this.lib.client.search(query.q || query.query, query);
			if (data.status !== 200) {
				return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
			}
			return { data: data.data.statuses };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
