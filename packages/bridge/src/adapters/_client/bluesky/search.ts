import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from '../_router/routes/search.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import {
	AppBskyActorSearchActorsTypeahead,
	AppBskyFeedSearchPosts,
	AtpSessionData,
} from '@atproto/api';
import { getBskyAgent } from '../_router/_api.js';
import { MastoStatus } from '../../../types/mastojs.types.js';
import { MegaStatus } from '../../../types/megalodon.types.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';

class BlueskySearchRouter implements SearchRoute {
	dto: AtpSessionData;
	constructor(dto: AtpSessionData) {
		this.dto = dto;
	}

	async findPosts(
		q: DhaagaJsPostSearchDTO,
	): LibraryPromise<
		| MastoStatus[]
		| Endpoints['notes/search']['res']
		| MegaStatus[]
		| AppBskyFeedSearchPosts.Response
	> {
		try {
			const agent = getBskyAgent(this.dto);
			const data = await agent.app.bsky.feed.searchPosts({
				q: q.q,
				limit: 10,
				sort: q.sort,
				cursor: q.maxId === null ? undefined : q.maxId,
			});

			if (!data.success) return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
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
