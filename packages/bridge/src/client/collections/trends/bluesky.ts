import { TrendsRoute } from './_interface.js';
import { GetTrendingDTO } from '#/client/typings.js';
import { MastoStatus, MastoTrendLink } from '#/types/mastojs.types.js';
import { getXrpcAgent } from '#/utils/atproto.js';
import {
	AppBskyActorDefs,
	AppBskyFeedDefs,
	AppBskyGraphDefs,
	AppBskyUnspeccedDefs,
} from '@atproto/api';
import { AppAtpSessionData } from '#/types/atproto.js';
import { PaginatedPromise } from '#/types/api-response.js';

type TrendQueryParams = {
	limit?: number;
	cursor?: string;
	query?: string;
};

class BlueskyTrendsRouter implements TrendsRoute {
	dto: AppAtpSessionData;
	constructor(dto: AppAtpSessionData) {
		this.dto = dto;
	}

	async links(opts: GetTrendingDTO): Promise<MastoTrendLink[]> {
		throw new Error('Method not implemented.');
	}

	async posts(opts: GetTrendingDTO): Promise<MastoStatus[]> {
		throw new Error('Method not implemented.');
	}

	async tags(opts: GetTrendingDTO): Promise<AppBskyUnspeccedDefs.TrendView[]> {
		const agent = getXrpcAgent(this.dto);
		const data = await agent.app.bsky.unspecced.getTrends({
			limit: opts.limit,
		});

		return data.data.trends;
	}

	async fetchPopularFeedGenerators(
		params: TrendQueryParams,
	): PaginatedPromise<AppBskyFeedDefs.GeneratorView[]> {
		const agent = getXrpcAgent(this.dto);
		const data =
			await agent.app.bsky.unspecced.getPopularFeedGenerators(params);
		return {
			data: data.data.feeds,
			maxId: data.data.cursor,
		};
	}

	async fetchSuggestedStarterPacks(
		params: TrendQueryParams,
	): Promise<AppBskyGraphDefs.StarterPackView[]> {
		const agent = getXrpcAgent(this.dto);
		const data =
			await agent.app.bsky.unspecced.getSuggestedStarterPacks(params);
		return data.data.starterPacks;
	}

	async fetchSuggestedFeeds(
		params: TrendQueryParams,
	): Promise<AppBskyFeedDefs.GeneratorView[]> {
		const agent = getXrpcAgent(this.dto);
		const data = await agent.app.bsky.unspecced.getSuggestedFeeds(params);
		return data.data.feeds;
	}

	async fetchSuggestedUsers(
		params: TrendQueryParams,
	): Promise<AppBskyActorDefs.ProfileView[]> {
		const agent = getXrpcAgent(this.dto);
		const data = await agent.app.bsky.unspecced.getSuggestedUsers(params);
		return data.data.actors;
	}
}

export default BlueskyTrendsRouter;
