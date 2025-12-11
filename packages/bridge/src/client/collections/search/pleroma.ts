import { SearchRoute } from './_interface.js';
import type { MegaAccount, MegaStatus } from '#/types/megalodon.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/client/utils/api-wrappers.js';
import { CasingUtil } from '#/utils/casing.js';
import { PaginatedPromise } from '#/types/api-response.js';
import { DhaagaJsUserSearchDTO } from '#/client/typings.js';

export class PleromaSearchRouter implements SearchRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	/**
	 * My instance is pretty slow on the FTS
	 *
	 * and I have not found any other search
	 * features in Pleroma/Akkoma
	 */
	async findUsers(
		query: DhaagaJsUserSearchDTO,
	): PaginatedPromise<MegaAccount[]> {
		const data = await this.client.client.search(query.q || query.query, query);
		return { data: data.data.accounts };
	}

	async findPosts(
		query: DhaagaJsUserSearchDTO,
	): PaginatedPromise<MegaStatus[]> {
		const data = await this.client.client.search(
			query.q || query.query,
			CasingUtil.snakeCaseKeys(query),
		);
		return { data: data.data.statuses };
	}
}
