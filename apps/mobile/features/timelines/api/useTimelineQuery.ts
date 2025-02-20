import { AppTimelineQuery } from './useTimelineController';
import { useQuery } from '@tanstack/react-query';
import {
	BlueskyRestClient,
	DhaagaJsTimelineQueryOptions,
	KNOWN_SOFTWARE,
	MisskeyRestClient,
	PleromaRestClient,
} from '@dhaaga/bridge';
import { TimelineFetchMode } from '../../../states/interactors/post-timeline.reducer';
import {
	useAppAcct,
	useAppApiClient,
} from '../../../hooks/utility/global-state-extractors';
import { AppBskyFeedGetTimeline } from '@atproto/api';
import { AppResultPageType } from '../../../types/app.types';
import { PostParser, DriverService } from '@dhaaga/core';
import type { PostObjectType } from '@dhaaga/core';

type TimelineQueryParams = {
	type: TimelineFetchMode;
	query?: AppTimelineQuery;
	opts?: DhaagaJsTimelineQueryOptions;
	minId?: string;
	maxId?: string;
	sessionId?: string;
};

type TimelineFetchResultType = AppResultPageType<PostObjectType>;

const DEFAULT_RETURN_VALUE: TimelineFetchResultType = {
	success: true,
	items: [],
	maxId: undefined,
	minId: undefined,
};

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
			success: true,
			items: generateFeedBatch(data),
			maxId: generateMaxId(data, maxId),
			minId: undefined,
		};
	}

	async function api(): Promise<TimelineFetchResultType> {
		if (client === null) return DEFAULT_RETURN_VALUE;
		switch (type) {
			case TimelineFetchMode.IDLE:
				return DEFAULT_RETURN_VALUE;
			case TimelineFetchMode.HOME: {
				const { data, error } = await client.timelines.home(_query);
				if (error) return DEFAULT_RETURN_VALUE;
				return createResultBatch(data);
			}
			case TimelineFetchMode.LOCAL: {
				const { data, error } = await client.timelines.public({
					..._query,
					local: true, // Pleroma/Akkoma thing
					withMuted: DriverService.supportsPleromaApi(driver)
						? true
						: undefined,
					withRenotes: !opts?.excludeReblogs,
					withReplies: !opts?.excludeReplies,
				});
				if (error) return DEFAULT_RETURN_VALUE;
				return createResultBatch(data);
			}
			case TimelineFetchMode.HASHTAG: {
				const { data, error } = await client.timelines.hashtag(_id, _query);
				console.log('all eyes on me', data, error);
				if (error) return DEFAULT_RETURN_VALUE;
				return createResultBatch(data);
			}
			case TimelineFetchMode.LIST: {
				const { data, error } = await client.timelines.list(_id, _query);
				if (error) return DEFAULT_RETURN_VALUE;
				return createResultBatch(data);
			}
			case TimelineFetchMode.USER: {
				const { data, error } = (await client.accounts.statuses(
					_id,
					_query,
				)) as any;
				if (error) return DEFAULT_RETURN_VALUE;
				return createResultBatch(data);
			}
			case TimelineFetchMode.SOCIAL: {
				const { data, error } = await client.timelines.public({
					..._query,
					social: true,
				});
				if (error) return DEFAULT_RETURN_VALUE;
				return createResultBatch(data);
			}
			case TimelineFetchMode.BUBBLE: {
				if (DriverService.supportsPleromaApi(driver)) {
					const { data } = await (client as PleromaRestClient).timelines.bubble(
						_query,
					);
					return {
						success: true,
						items: PostParser.parse<unknown[]>(data as any[], driver, server),
						maxId: generateMaxId(data),
						minId: undefined,
					};
				} else if (driver === KNOWN_SOFTWARE.SHARKEY) {
					const { data } = await (client as MisskeyRestClient).timelines.bubble(
						_query,
					);
					return {
						success: true,
						items: PostParser.parse<unknown[]>(data as any[], driver, server),
						maxId: generateMaxId(data),
						minId: undefined,
					};
				} else {
					return DEFAULT_RETURN_VALUE;
				}
			}
			case TimelineFetchMode.FEDERATED: {
				const { data, error } = await client.timelines.public(_query);
				if (error) return DEFAULT_RETURN_VALUE;
				return createResultBatch(data);
			}
			case TimelineFetchMode.BOOKMARKS: {
				const { data, error } = await client.accounts.bookmarks(_query);
				if (error) return DEFAULT_RETURN_VALUE;
				return createResultBatch(data.data, data?.maxId);
			}
			case TimelineFetchMode.FEED: {
				const { data, error } = await (
					client as BlueskyRestClient
				).timelines.feed({
					limit: TIMELINE_STATUS_LIMIT,
					cursor: maxId === null ? undefined : maxId,
					feed: query.id,
				});
				if (error) return DEFAULT_RETURN_VALUE;
				return outputSchemaToResultPage(data);
			}
			case TimelineFetchMode.LIKES: {
				if (DriverService.supportsAtProto(driver)) {
					const { data, error } = await (
						client as BlueskyRestClient
					).accounts.atProtoLikes(acct.identifier, {
						limit: TIMELINE_STATUS_LIMIT,
						cursor: _query.maxId === null ? undefined : _query.maxId,
					});
					if (error) return DEFAULT_RETURN_VALUE;
					return {
						success: true,
						items: PostParser.parse<unknown[]>(data.feed, driver, server),
						maxId: data.cursor === undefined ? null : data.cursor,
						minId: null,
					};
				}

				const { data, error } = await client.accounts.likes(_query);
				if (error) return DEFAULT_RETURN_VALUE;
				return createResultBatch(data.data, data.maxId);
			}
			default:
				return DEFAULT_RETURN_VALUE;
		}
	}

	// Queries
	return useQuery<TimelineFetchResultType>({
		queryKey: [type, _id, _query, maxId, minId, sessionId],
		queryFn: api,
		enabled: !!client && type !== TimelineFetchMode.IDLE,
		initialData: DEFAULT_RETURN_VALUE,
	});
}

export default useTimelineQuery;
