import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from '../_router/routes/search.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import {
	AppBskyActorSearchActorsTypeahead,
	AtpSessionData,
} from '@atproto/api';
import { getBskyAgent } from '../_router/_api.js';
import { MastoStatus } from '../../../types/mastojs.types.js';
import { MegaStatus } from '../../../types/megalodon.types.js';

class BlueskySearchRouter implements SearchRoute {
	dto: AtpSessionData;
	constructor(dto: AtpSessionData) {
		this.dto = dto;
	}

	findPosts(
		q: DhaagaJsPostSearchDTO,
	): LibraryPromise<
		MastoStatus[] | Endpoints['notes/search']['res'] | MegaStatus[]
	> {
		return Promise.resolve(undefined) as any;
	}

	async findUsers(
		q: DhaagaJsUserSearchDTO,
	): LibraryPromise<AppBskyActorSearchActorsTypeahead.Response> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.app.bsky.actor.searchActorsTypeahead({
			q: q.q,
			limit: q.limit || 8,
		});
		return { data };
	}
}

export default BlueskySearchRouter;
