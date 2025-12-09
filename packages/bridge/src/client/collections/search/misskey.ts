import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from './_interface.js';
import { Endpoints } from 'misskey-js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';
import { PaginatedPromise } from '#/types/api-response.js';

export class MisskeySearchRouter implements SearchRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async findUsers(
		query: DhaagaJsUserSearchDTO,
	): PaginatedPromise<Endpoints['users/search']['res']> {
		const data = await this.client.client.request('users/search', query);
		return { data };
	}

	async findPosts(
		query: DhaagaJsPostSearchDTO,
	): PaginatedPromise<Endpoints['notes/search']['res']> {
		const data = await this.client.client.request('notes/search', query);
		return { data };
	}
}
