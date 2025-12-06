import { DhaagaJsUserSearchDTO, SearchRoute } from './_interface.js';
import type { MegaAccount, MegaStatus } from '#/types/megalodon.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/client/utils/api-wrappers.js';
import { CasingUtil } from '#/utils/casing.js';
import { getHumanReadableError } from '#/utils/errors.js';
import { LibraryPromise } from '#/types/index.js';

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
	async findUsers(query: DhaagaJsUserSearchDTO): LibraryPromise<MegaAccount[]> {
		try {
			const data = await this.client.client.search(
				query.q || query.query,
				query,
			);
			if (data.status !== 200) {
				throw new Error('not authorized');
			}
			return { data: data.data.accounts };
		} catch (e) {
			throw new Error(getHumanReadableError(e));
		}
	}

	async findPosts(query: DhaagaJsUserSearchDTO): LibraryPromise<MegaStatus[]> {
		try {
			const data = await this.client.client.search(
				query.q || query.query,
				CasingUtil.snakeCaseKeys(query),
			);
			if (data.status !== 200) {
				throw new Error('not authorized');
			}
			return { data: data.data.statuses };
		} catch (e) {
			throw new Error(getHumanReadableError(e));
		}
	}
}
