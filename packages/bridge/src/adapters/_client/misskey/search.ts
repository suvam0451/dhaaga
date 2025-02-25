import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from '../_router/routes/search.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { ApiErrorCode } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MisskeySearchRouter implements SearchRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async findUsers(
		query: DhaagaJsUserSearchDTO,
	): LibraryPromise<Endpoints['users/search']['res']> {
		try {
			const data = await this.client.client.request('users/search', query);
			return { data };
		} catch (e) {
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async findPosts(
		query: DhaagaJsPostSearchDTO,
	): LibraryPromise<Endpoints['notes/search']['res']> {
		try {
			const data = await this.client.client.request('notes/search', query);
			return { data };
		} catch (e) {
			console.log('[ERROR]: performing search', e);
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}
}
