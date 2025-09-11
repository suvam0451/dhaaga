import { AppTimelineQuery } from './useTimelineController';
import { useQuery } from '@tanstack/react-query';
import {
	AtprotoApiAdapter,
	DhaagaJsTimelineQueryOptions,
	KeyExtractorUtil,
	KNOWN_SOFTWARE,
	MisskeyApiAdapter,
	PleromaApiAdapter,
} from '@dhaaga/bridge';
import { TimelineFetchMode } from '@dhaaga/core';
import {
	useAppAcct,
	useAppApiClient,
} from '../../../hooks/utility/global-state-extractors';
import { AppBskyFeedGetTimeline } from '@atproto/api';
import { AppResultPageType } from '../../../types/app.types';
import { PostParser, DriverService, defaultResultPage } from '@dhaaga/bridge';
import type { PostObjectType, ResultPage } from '@dhaaga/bridge';
import { ApiResult } from '@dhaaga/bridge';

type TimelineQueryParams = {
	type: TimelineFetchMode;
	query?: AppTimelineQuery;
	opts?: DhaagaJsTimelineQueryOptions;
	minId?: string;
	maxId?: string;
	sessionId?: string;
};

type TimelineFetchResultType = ResultPage<PostObjectType>;

/**
 * Use to fetch paginated data for
 * various timelines containing posts
 *
 * Is consumed by various DataViews
 */
function useTimelineQuery({
	type,
	query,
	opts,
	maxId,
	minId,
	sessionId,
}: TimelineQueryParams) {
	const { client, driver, server } = useAppApiClient();

	const { acct } = useAppAcct();

	// to be adjusted based on performance
	const TIMELINE_STATUS_LIMIT = 20;

	const _id = query?.id;
	const _query = {
		// the actual options
		...opts,

		// injected
		limit: TIMELINE_STATUS_LIMIT,
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
	function generateMaxId(data: any, maxId?: string | null): string | null {
		if (maxId) return maxId;

		if (DriverService.supportsAtProto(driver)) {
			if (data.posts !== undefined) return data.cursor;
			const _payload = data as unknown as AppBskyFeedGetTimeline.Response;
			return _payload.data.cursor;
		} else {
			return data[data.length - 1]?.id;
		}
	}

	function getPageFromResult(result: ApiResult<any>) {
		if (result.isErr()) {
			console.log('[WARN]: this timeline failed to load...');
			return defaultResultPage;
		}
		return KeyExtractorUtil.getPage<PostObjectType>(result.unwrap(), (o) =>
			PostParser.parse<unknown[]>(o, driver, server),
		);
	}

	function outputSchemaToResultPage(
		data: any,
	): AppResultPageType<PostObjectType> {
		return {
			success: true,
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
	): TimelineFetchResultType {
		return {
			items: generateFeedBatch(data),
			maxId: generateMaxId(data, maxId),
			minId: null,
		};
	}

	async function api(): Promise<TimelineFetchResultType> {
		if (client === null) return defaultResultPage;
		switch (type) {
			case TimelineFetchMode.IDLE:
				return defaultResultPage;
			case TimelineFetchMode.HOME: {
				const result = await client.timelines.home(_query);
				if (result.isErr()) return defaultResultPage;
				return createResultBatch(result.unwrap());
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
				console.log(result);
				if (result.isErr()) return defaultResultPage;
				return createResultBatch(result.unwrap());
			}
			case TimelineFetchMode.HASHTAG: {
				const result = await client.timelines.hashtag(_id, _query);
				if (result.isErr()) return defaultResultPage;
				return createResultBatch(result.unwrap());
			}
			case TimelineFetchMode.LIST: {
				const result = await client.timelines.list(_id, _query);
				if (result.isErr()) return defaultResultPage;
				return createResultBatch(result.unwrap());
			}
			case TimelineFetchMode.USER: {
				const result = await client.accounts.statuses(_id, _query);
				if (result.isErr()) return defaultResultPage;
				return createResultBatch(result.unwrap());
			}
			case TimelineFetchMode.SOCIAL: {
				const result = await client.timelines.public({
					..._query,
					social: true,
				});
				if (result.isErr()) return defaultResultPage;
				return createResultBatch(result.unwrap());
			}
			case TimelineFetchMode.BUBBLE: {
				if (DriverService.supportsPleromaApi(driver)) {
					const result = await (client as PleromaApiAdapter).timelines.bubble(
						_query,
					);
					if (result.isErr()) return defaultResultPage;
					return {
						items: PostParser.parse<unknown[]>(
							result.unwrap() as any[],
							driver,
							server,
						),
						maxId: generateMaxId(result.unwrap()),
						minId: null,
					};
				} else if (driver === KNOWN_SOFTWARE.SHARKEY) {
					const result = await (client as MisskeyApiAdapter).timelines.bubble(
						_query,
					);
					if (result.isErr()) return defaultResultPage;
					return {
						items: PostParser.parse<unknown[]>(
							result.unwrap() as any[],
							driver,
							server,
						),
						maxId: generateMaxId(result.unwrap()),
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
				const { data, error } = await (
					client as AtprotoApiAdapter
				).timelines.feed({
					limit: TIMELINE_STATUS_LIMIT,
					cursor: maxId === null ? undefined : maxId,
					feed: query.id,
				});
				if (error) return defaultResultPage;
				return outputSchemaToResultPage(data);
			}
			case TimelineFetchMode.LIKES: {
				if (DriverService.supportsAtProto(driver)) {
					const { data, error } = await (
						client as AtprotoApiAdapter
					).accounts.atProtoLikes(acct.identifier, {
						limit: TIMELINE_STATUS_LIMIT,
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
			default:
				return defaultResultPage;
		}
	}

	// Queries
	return useQuery<TimelineFetchResultType>({
		queryKey: [type, _id, _query, maxId, minId, sessionId],
		queryFn: api,
		enabled: !!client && type !== TimelineFetchMode.IDLE,
		initialData: defaultResultPage,
	});
}

export default useTimelineQuery;
