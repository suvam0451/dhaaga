import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from './_interface.js';
import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import {
	AppBskyActorSearchActorsTypeahead,
	AppBskyFeedSearchPosts,
	AppBskyUnspeccedGetPopularFeedGenerators,
} from '@atproto/api';
import { MastoStatus } from '#/types/mastojs.types.js';
import { MegaStatus } from '#/types/megalodon.types.js';
import { errorBuilder } from '#/adapters/_client/_router/dto/api-responses.dto.js';
import { ApiErrorCode } from '#/types/result.types.js';
import { AppAtpSessionData } from '#/types/atproto.js';
import { getBskyAgent, getXrpcAgent } from '#/utils/atproto.js';

class BlueskySearchRouter implements SearchRoute {
	dto: AppAtpSessionData;

	constructor(dto: AppAtpSessionData) {
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

			if (!data.success) return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
			return { data };
		} catch (e) {
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
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

	async findFeeds(
		query: AppBskyUnspeccedGetPopularFeedGenerators.QueryParams,
	): LibraryPromise<AppBskyUnspeccedGetPopularFeedGenerators.OutputSchema> {
		const agent = getXrpcAgent(this.dto);
		return agent.app.bsky.unspecced.getPopularFeedGenerators(query);
	}
}

export default BlueskySearchRouter;
