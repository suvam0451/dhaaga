import { SearchRoute } from './_interface.js';
import {
	AppBskyActorDefs,
	AppBskyFeedDefs,
	AppBskyUnspeccedGetPopularFeedGenerators,
} from '@atproto/api';
import { AppAtpSessionData } from '#/types/atproto.js';
import { getBskyAgent, getXrpcAgent } from '#/utils/atproto.js';
import { errorBuilder } from '#/types/index.js';
import { ApiErrorCode, PaginatedPromise } from '#/types/api-response.js';
import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
} from '#/client/typings.js';

class BlueskySearchRouter implements SearchRoute {
	dto: AppAtpSessionData;

	constructor(dto: AppAtpSessionData) {
		this.dto = dto;
	}

	async findPosts(
		q: DhaagaJsPostSearchDTO,
	): PaginatedPromise<AppBskyFeedDefs.PostView[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.app.bsky.feed.searchPosts({
			q: q.q,
			limit: 10,
			sort: q.sort,
			cursor: q.maxId === null ? undefined : q.maxId,
		});

		if (!data.success) return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		return {
			data: data.data.posts,
			maxId: data.data.cursor,
			hitsTotal: data.data.hitsTotal,
		};
	}

	async findUsers(
		q: DhaagaJsUserSearchDTO,
	): PaginatedPromise<AppBskyActorDefs.ProfileView[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.app.bsky.actor.searchActors({
			q: q.q,
			limit: q.limit || 8,
		});
		return { data: data.data.actors, maxId: null };
	}

	async findUsersTypeAhead(
		q: DhaagaJsUserSearchDTO,
	): PaginatedPromise<AppBskyActorDefs.ProfileViewBasic[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.app.bsky.actor.searchActorsTypeahead({
			q: q.q,
			limit: q.limit || 8,
		});
		return { data: data.data.actors, maxId: null };
	}

	async findFeeds(
		query: AppBskyUnspeccedGetPopularFeedGenerators.QueryParams,
	): PaginatedPromise<AppBskyFeedDefs.GeneratorView[]> {
		const agent = getXrpcAgent(this.dto);
		const data = await agent.app.bsky.unspecced.getPopularFeedGenerators(query);
		return { data: data.data.feeds, maxId: data.data.cursor };
	}
}

export default BlueskySearchRouter;
