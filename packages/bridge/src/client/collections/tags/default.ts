import { TagRoute } from './_interface.js';

import { MastoTag } from '#/types/mastojs.types.js';
import { PaginatedPromise } from '#/types/api-response.js';

export class DefaultTagRouter implements TagRoute {
	async followedTags(): PaginatedPromise<MastoTag[]> {
		return { data: [] };
	}

	async follow(): Promise<MastoTag> {
		throw new Error('Method not implemented.');
	}

	async get(): Promise<MastoTag> {
		throw new Error('Method not implemented.');
	}

	async unfollow(): Promise<MastoTag> {
		throw new Error('Method not implemented.');
	}
}
