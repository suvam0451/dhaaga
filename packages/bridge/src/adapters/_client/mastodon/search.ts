import {
	DhaagaJsUserSearchDTO,
	MastoUnifiedSearchType,
	SearchRoute,
} from '../_router/routes/search.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	MastoAccount,
	MastoStatus,
	MastoTag,
} from '../../../types/mastojs.types.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MastodonSearchRouter implements SearchRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async findUsers(
		query: DhaagaJsUserSearchDTO,
	): LibraryPromise<MastoAccount[]> {
		try {
			const data = await this.client.lib.v2.search.list({
				...query,
				q: query.query,
			});
			return { data: data.accounts };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async findPosts(query: DhaagaJsUserSearchDTO): LibraryPromise<MastoStatus[]> {
		try {
			const data = await this.client.lib.v2.search.list({
				...query,
				q: query.query,
			});
			return { data: data.statuses };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async unifiedSearch(query: MastoUnifiedSearchType): LibraryPromise<{
		accounts: MastoAccount[];
		statuses: MastoStatus[];
		hashtags: MastoTag[];
	}> {
		try {
			const data = await this.client.lib.v2.search.list({
				...query,
			});
			return { data: data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
