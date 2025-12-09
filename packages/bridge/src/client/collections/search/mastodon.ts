import {
	DhaagaJsUserSearchDTO,
	MastoUnifiedSearchType,
	SearchRoute,
} from './_interface.js';
import { MastoAccount, MastoStatus, MastoTag } from '#/types/mastojs.types.js';
import { ApiErrorCode } from '#/types/result.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { errorBuilder } from '#/types/index.js';
import { PaginatedPromise } from '#/types/api-response.js';

export class MastodonSearchRouter implements SearchRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async findUsers(
		query: DhaagaJsUserSearchDTO,
	): PaginatedPromise<MastoAccount[]> {
		const data = await this.client.lib.v2.search.list({
			...query,
			q: query.query,
		});
		return {
			data: data.accounts,
			maxId: data.accounts.length
				? data.accounts[data.accounts.length - 1].id
				: undefined,
		};
	}

	async findPosts(
		query: DhaagaJsUserSearchDTO,
	): PaginatedPromise<MastoStatus[]> {
		const data = await this.client.lib.v2.search.list({
			...query,
			q: query.query,
		});
		return {
			data: data.statuses,
			maxId: data.statuses.length
				? data.statuses[data.statuses.length - 1].id
				: undefined,
		};
	}

	async unifiedSearch(query: MastoUnifiedSearchType): Promise<{
		accounts: MastoAccount[];
		statuses: MastoStatus[];
		hashtags: MastoTag[];
	}> {
		try {
			return await this.client.lib.v2.search.list({
				...query,
			});
		} catch (e) {
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}
}
