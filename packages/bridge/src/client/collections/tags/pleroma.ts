import {
	PaginatedPromise,
	LibraryPromise,
} from '#/adapters/_client/_router/routes/_types.js';
import { TagRoute } from './_interface.js';
import { MegaTag } from '#/types/megalodon.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/custom-clients/custom-clients.js';

export class PleromaTagsRouter implements TagRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async followedTags(): PaginatedPromise<MegaTag[]> {
		const data = await this.client.client.getFollowedTags();
		return {
			data: data.data,
		};
	}

	async follow(id: string): LibraryPromise<MegaTag> {
		const data = await this.client.client.followTag(id);
		return { data: data.data };
	}

	async get(id: string): LibraryPromise<MegaTag> {
		const data = await this.client.client.getTag(id);
		return { data: data.data };
	}

	async unfollow(id: string): LibraryPromise<MegaTag> {
		const data = await this.client.client.unfollowTag(id);
		return { data: data.data };
	}
}
