import {
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from '../_router/routes/search.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import type {
	MegaAccount,
	MegaStatus,
} from '../../../types/megalodon.types.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';
import { CasingUtil } from '../../../utils/casing.js';

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
				return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
			}
			return { data: data.data.accounts };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async findPosts(query: DhaagaJsUserSearchDTO): LibraryPromise<MegaStatus[]> {
		try {
			const data = await this.client.client.search(
				query.q || query.query,
				CasingUtil.snakeCaseKeys(query),
			);
			if (data.status !== 200) {
				return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
			}
			return { data: data.data.statuses };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
