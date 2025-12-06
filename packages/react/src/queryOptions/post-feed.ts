import {
	ApiTargetInterface,
	AtprotoApiAdapter,
	defaultResultPage,
	DhaagaJsTimelineQueryOptions,
	DriverService,
	KeyExtractorUtil,
	KNOWN_SOFTWARE,
	MisskeyApiAdapter,
	PleromaApiAdapter,
	PostParser,
	type ResultPage,
} from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge/typings';
import { TimelineFetchMode } from '@dhaaga/core';
import { queryOptions } from '@tanstack/react-query';
import type { AppBskyFeedGetTimeline } from '@atproto/api';

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

type PostFeedFetchResultType = ResultPage<PostObjectType>;

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
	 * Generates the cursor based on driver
	 *
	 * Only Mastodon and forks are known to embed
	 * the pagination in headers.
	 *
	 * So, either populate maxId in this function
	 * or use the maxId directly
	 * @param data
	 * @param maxId
	 */
	function generateMaxId(
		data: any,
		maxId?: string | null,
	): string | null | undefined {
		if (maxId) return maxId;

		if (DriverService.supportsAtProto(driver)) {
			if (data.posts !== undefined) return data.cursor;
			const _payload = data as unknown as AppBskyFeedGetTimeline.Response;
			return _payload.data.cursor;
		} else {
			return data[data.length - 1]?.id;
		}
	}

	function getPageFromResult(result: any) {
		if (!result) {
			console.log('[WARN]: this timeline failed to load...');
			return defaultResultPage;
		}
		return KeyExtractorUtil.getPage<PostObjectType>(result, (o) =>
			PostParser.parse<unknown[]>(o, driver, server),
		);
	}

	function outputSchemaToResultPage(data: any): PostFeedFetchResultType {
		return {
			// success: true,
			items: PostParser.parse<unknown[]>(data.feed, driver, server),
			maxId: data.cursor === undefined ? null : data.cursor,
			minId: null,
		};
	}

	function generateFeedBatch(data: any) {
		let _feed = [];
		if (DriverService.supportsAtProto(driver)) {
			if (data.posts) {
				// for hashtags
				_feed = data.posts;
			} else {
				const _payload = data as unknown as AppBskyFeedGetTimeline.Response;
				_feed = _payload.data.feed;
			}
		} else {
			_feed = data.posts ? data.posts : data;
		}

		try {
			return PostParser.parse<unknown[]>(_feed, driver, server);
		} catch (e) {
			console.log('[ERROR]: failed to convert posts', e);
			return [];
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
			items: generateFeedBatch(data),
			maxId: generateMaxId(data, maxId),
			minId: null,
		};
	}

	async function api(): Promise<PostFeedFetchResultType> {
		switch (type) {
			case TimelineFetchMode.IDLE:
				return defaultResultPage;
			case TimelineFetchMode.HOME: {
				const result = await client.timelines.home(_query);
				return createResultBatch(result);
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
				return createResultBatch(result);
			}
			case TimelineFetchMode.HASHTAG: {
				const result = await client.timelines.hashtag(_id!, _query);
				return createResultBatch(result);
			}
			case TimelineFetchMode.LIST: {
				const result = await client.timelines.list(_id!, _query);
				return createResultBatch(result);
			}
			case TimelineFetchMode.USER: {
				if (!_query || _query.userId === undefined)
					throw new Error('missing userId');
				const result = await client.accounts.statuses(_id!, _query as any);
				return createResultBatch(result);
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
						items: PostParser.parse<unknown[]>(result as any[], driver, server),
						maxId: generateMaxId(result),
						minId: null,
					};
				} else if (driver === KNOWN_SOFTWARE.SHARKEY) {
					const result = await (client as MisskeyApiAdapter).timelines.bubble(
						_query,
					);
					return {
						items: PostParser.parse<unknown[]>(result as any[], driver, server),
						maxId: generateMaxId(result),
						minId: null,
					};
				} else {
					return defaultResultPage;
				}
			}
			case TimelineFetchMode.FEDERATED: {
				const result = await client.timelines.public(_query);
				return getPageFromResult(result);
			}
			case TimelineFetchMode.BOOKMARKS: {
				const { data, error } = await client.accounts.bookmarks(_query);
				if (error) return defaultResultPage;
				return createResultBatch(data.data, data?.maxId);
			}
			case TimelineFetchMode.FEED: {
				const data = await (client as AtprotoApiAdapter).timelines.feed({
					limit,
					cursor: maxId === null ? undefined : maxId,
					feed: query!.id,
				});

				return outputSchemaToResultPage(data);
			}
			case TimelineFetchMode.LIKES: {
				if (DriverService.supportsAtProto(driver)) {
					const { data, error } = await (
						client as AtprotoApiAdapter
					).accounts.atProtoLikes(acctIdentifier, {
						limit,
						cursor: _query.maxId === null ? undefined : _query.maxId,
					});
					if (error) return defaultResultPage;
					return {
						items: PostParser.parse<unknown[]>(data.feed, driver, server),
						maxId: data.cursor === undefined ? null : data.cursor,
						minId: null,
					};
				}

				const { data, error } = await client.accounts.likes(_query);
				if (error) return defaultResultPage;
				return createResultBatch(data.data, data.maxId);
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
