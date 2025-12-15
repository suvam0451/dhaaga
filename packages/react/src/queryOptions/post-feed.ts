import {
	ApiTargetInterface,
	AtprotoApiAdapter,
	defaultResultPage,
	DhaagaJsTimelineQueryOptions,
	DriverService,
	KNOWN_SOFTWARE,
	MisskeyApiAdapter,
	PleromaApiAdapter,
	PostParser,
} from '@dhaaga/bridge';
import type { PostObjectType, ResultPage } from '@dhaaga/bridge';
import { TimelineFetchMode } from '@dhaaga/core';
import { queryOptions } from '@tanstack/react-query';

type PostFeedQueryParams = {
	type: TimelineFetchMode;
	query?: {
		id: string;
		label: string;
	};
	opts?: DhaagaJsTimelineQueryOptions;
	minId?: string;
	maxId?: string;
	sessionId?: string;
	/**
	 * 	to be adjusted based on polish
	 */
	limit?: number;
};

type PostFeedFetchResultType = ResultPage<PostObjectType[]>;

/**
 * intended for use by single column timelines,
 * where the target feed updates based on the
 * input options
 */
export function unifiedPostFeedQueryOptions(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	server: string,
	acctIdentifier: string,
	{
		type,
		query,
		opts,
		maxId,
		minId,
		sessionId,
		limit = 15,
	}: PostFeedQueryParams,
) {
	const _id = query?.id;
	const _query = {
		// the actual options
		...opts,

		// injected
		limit: limit!,
		sinceId: minId,
		untilId: maxId === null ? undefined : maxId,
		maxId,
		minId, // quirks
		userId: _id,
	};

	/**
	 * Generates the cursor (unless already
	 * supplied by the client collections)
	 *
	 * ^ For Mastodon and forks, which embed
	 * the pagination in headers, we should
	 * always use the maxId supplied.
	 *
	 * @param data
	 * @param maxId
	 */
	function _parseCursorData(
		data: ResultPage<any> | any[],
		maxId?: string | null,
	): string | null | undefined {
		if (maxId) return maxId;

		// ResultPage with maxId
		if (
			typeof data === 'object' &&
			!Array.isArray(data) &&
			Object.hasOwn(data, 'maxId') &&
			data.maxId != null
		) {
			return data.maxId;
		}

		// Plain array
		if (Array.isArray(data)) {
			return data.length > 0 ? (data[data.length - 1].id ?? null) : null;
		}

		// ResultPage with data array (fallback)
		if (Array.isArray(data.data)) {
			return data.data.length > 0
				? (data.data[data.data.length - 1].id ?? null)
				: null;
		}

		throw new Error('unknown cursor format for returned feed');
	}

	function _parseFeedData(data: any) {
		if (data.data) {
			return PostParser.parse<unknown[]>(data.data, driver, server);
		} else if (Array.isArray(data)) {
			return PostParser.parse<unknown[]>(data, driver, server);
		} else {
			throw new Error('unknown data format for returned feed');
		}
	}

	/**
	 * aggregated all information that need to
	 * be calculated to continue the feed
	 * @param data
	 * @param maxId
	 */
	function createResultBatch(
		data: any,
		maxId?: string | null,
	): PostFeedFetchResultType {
		return {
			data: _parseFeedData(data),
			maxId: _parseCursorData(data, maxId),
			minId: null,
		};
	}

	async function api(): Promise<PostFeedFetchResultType> {
		switch (type) {
			case TimelineFetchMode.IDLE:
				return defaultResultPage;
			case TimelineFetchMode.HOME: {
				const result = await client.timelines.home(_query);
				return createResultBatch(result.data, result.maxId);
			}
			case TimelineFetchMode.LOCAL: {
				const result = await client.timelines.public({
					..._query,
					local: true, // Pleroma/Akkoma thing
					withMuted: DriverService.supportsPleromaApi(driver)
						? true
						: undefined,
					withRenotes: !opts?.excludeReblogs,
					withReplies: !opts?.excludeReplies,
				});
				return createResultBatch(result.data, result.maxId);
			}
			case TimelineFetchMode.HASHTAG: {
				const data = await client.timelines.hashtag(_id!, _query);
				return createResultBatch(data.data, data.maxId);
			}
			case TimelineFetchMode.LIST: {
				const result = await client.timelines.list(_id!, _query);
				return createResultBatch(result);
			}
			case TimelineFetchMode.USER: {
				if (!_query || _query.userId === undefined)
					throw new Error('missing userId');
				const data = await client.users.getPosts(_id!, _query as any);
				return createResultBatch(data.data, data.maxId);
			}
			case TimelineFetchMode.SOCIAL: {
				const result = await client.timelines.public({
					..._query,
					social: true,
				});
				return createResultBatch(result);
			}
			case TimelineFetchMode.BUBBLE: {
				if (DriverService.supportsPleromaApi(driver)) {
					const result = await (client as PleromaApiAdapter).timelines.bubble(
						_query,
					);
					return {
						data: PostParser.parse<unknown[]>(
							result.data as any[],
							driver,
							server,
						),
						maxId: _parseCursorData(result.data),
						minId: null,
					};
				} else if (driver === KNOWN_SOFTWARE.SHARKEY) {
					const result = await (client as MisskeyApiAdapter).timelines.bubble(
						_query,
					);
					return {
						data: PostParser.parse<unknown[]>(result as any[], driver, server),
						maxId: _parseCursorData(result),
						minId: null,
					};
				} else {
					return defaultResultPage;
				}
			}
			case TimelineFetchMode.FEDERATED: {
				const data = await client.timelines.public(_query);
				return createResultBatch(data.data, data.maxId);
			}
			case TimelineFetchMode.BOOKMARKS: {
				const data = await client.users.bookmarks(_query);
				return createResultBatch(data.data, data?.maxId);
			}
			case TimelineFetchMode.FEED: {
				const data = await (client as AtprotoApiAdapter).timelines.getFeed({
					limit,
					cursor: maxId === null ? undefined : maxId,
					feed: query!.id,
				});

				return createResultBatch(data.data, data.maxId);
			}
			case TimelineFetchMode.LIKES: {
				if (DriverService.supportsAtProto(driver)) {
					const data = await (client as AtprotoApiAdapter).users.atProtoLikes(
						acctIdentifier,
						{
							limit,
							cursor: _query.maxId === null ? undefined : _query.maxId,
						},
					);
					return createResultBatch(data.data, data.maxId);
				}

				const data = await client.users.likes(_query);
				return createResultBatch(data.data, data.maxId);
			}
			case TimelineFetchMode.TRENDING_POSTS: {
				if (!DriverService.supportsMastoApiV2(driver)) {
					throw new Error(
						'trending posts only supported on Mastodon v2 API compatible servers',
					);
				}
				const data = await client.trends.posts({
					limit: 20,
					offset: 0,
				});
				return createResultBatch(data);
			}
			case TimelineFetchMode.TRENDING_USERS: {
				if (!DriverService.supportsMastoApiV2(driver)) {
					throw new Error(
						'trending posts only supported on Mastodon v2 API compatible servers',
					);
				}
				const data = await client.trends.posts({
					limit: 20,
					offset: 0,
				});
				return createResultBatch(data);
			}
			case TimelineFetchMode.TRENDING_TAGS: {
				if (!DriverService.supportsMastoApiV2(driver)) {
					throw new Error(
						'trending posts only supported on Mastodon v2 API compatible servers',
					);
				}
				const data = await client.trends.posts({
					limit: 20,
					offset: 0,
				});
				return createResultBatch(data);
			}
			default: {
				throw new Error(`unknown timeline type: ${type}`);
			}
		}
	}

	// Queries
	return queryOptions<PostFeedFetchResultType>({
		queryKey: [
			'dhaaga/feed/unified/posts',
			type,
			_id,
			_query,
			maxId,
			minId,
			sessionId,
		],
		queryFn: api,
		enabled: !!client && type !== TimelineFetchMode.IDLE,
		initialData: defaultResultPage,
	});
}
