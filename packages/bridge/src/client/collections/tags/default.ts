import { PaginatedPromise } from '#/adapters/_client/_router/routes/_types.js';
import { TagRoute } from './_interface.js';

import { MastoTag } from '#/types/mastojs.types.js';

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
