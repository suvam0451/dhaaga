import {
	PaginatedLibraryPromise,
	LibraryPromise,
} from '../_router/routes/_types.js';
import { TagRoute } from '../_router/routes/tags.js';
import { MegaTag } from '../../../types/megalodon.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';

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

	async followedTags(): PaginatedLibraryPromise<MegaTag[]> {
		const data = await this.client.client.getFollowedTags();

		return {
			data: {
				data: data.data,
			},
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
