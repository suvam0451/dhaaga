import {
	DhaagaJsUserSearchDTO,
	MastoUnifiedSearchType,
	SearchRoute,
} from './_interface.js';
import { errorBuilder } from '#/adapters/_client/_router/dto/api-responses.dto.js';
import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import { MastoAccount, MastoStatus, MastoTag } from '#/types/mastojs.types.js';
import { ApiErrorCode } from '#/types/result.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/custom-clients.js';

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
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
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
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
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
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}
}
