import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '../utility/global-state-extractors';
import { AppBskyFeedSearchPosts } from '@atproto/api';
import ActivitypubService from '../../services/activitypub.service';
import {
	UserParser,
	PostParser,
	DriverService,
	defaultResultPage,
	FeedParser,
	AtprotoApiAdapter,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import type {
	UserObjectType,
	PostObjectType,
	FeedObjectType,
	ResultPage,
} from '@dhaaga/bridge';

/**
 * ------ Shared ------
 */

type PostResultPage = ResultPage<PostObjectType>;
type FeedResultPage = ResultPage<FeedObjectType>;

/**
 * --------------------
 */

/**
 * Search and paginate through for feeds
 * @param q query
 * @param maxId cursor
 */
export function useApiSearchFeeds(q: string, maxId: string | null) {
	const { client, server, driver } = useAppApiClient();

	return useQuery<FeedResultPage>({
		queryKey: ['search/feeds', server, q, maxId],
		queryFn: async () => {
			if (!q) return defaultResultPage;
			const { data, error } = await (
				client as AtprotoApiAdapter
			).search.findFeeds({
				limit: 5,
				query: q,
				cursor: maxId,
			});
			if (error) return defaultResultPage;
			console.log(data);
			return {
				...defaultResultPage,
				items: FeedParser.parse<unknown[]>(data.feeds, driver, server),
				maxId: data.cursor,
			};
		},
		enabled: !!client && DriverService.supportsAtProto(driver),
		initialData: defaultResultPage,
	});
}

/**
 * Search and paginate through for users
 * @param q query
 * @param maxId cursor
 */
export function useApiSearchUsers(q: string, maxId: string | null) {
	const { client, server, driver } = useAppApiClient();

	async function api(): Promise<UserObjectType[]> {
		const { data, error } = await client.search.findUsers({
			maxId,
			q,
			limit: 10,
			query: q,
			type: 'accounts',
			untilId: maxId,
		});
		if (error) {
			console.log('[WARN]: error searching for posts', error.message);
			throw new Error(error.message);
		}
		if (ActivitypubService.blueskyLike(driver)) {
			return UserParser.parse<unknown[]>(
				(data as any).data.actors as any[],
				driver,
				server,
			);
		} else {
			return UserParser.parse<unknown[]>(data as any[], driver, server);
		}
	}

	return useQuery<UserObjectType[]>({
		queryKey: ['search/users', server, q, maxId],
		queryFn: api,
		enabled: client !== null && !!q,
		initialData: [],
	});
}

/**
 * Search and paginate through for posts
 * @param q query
 * @param maxId cursor
 * @param sort (bluesky only) "top"/"latest" search tabs
 */
export function useApiSearchPosts(
	q: string,
	maxId: string | null,
	sort?: 'top' | 'latest',
) {
	const { client, server, driver } = useAppApiClient();

	async function api(): Promise<PostResultPage> {
		// Akko-gang, nani da fukk? Y your maxId no work? 😭
		// et tu, sharks 🤨?
		const FALLBACK_TO_OFFSET = [
			KNOWN_SOFTWARE.AKKOMA,
			KNOWN_SOFTWARE.SHARKEY,
		].includes(driver);
		const offset = FALLBACK_TO_OFFSET
			? maxId
				? parseInt(maxId)
				: undefined
			: undefined;
		const _maxId = FALLBACK_TO_OFFSET ? undefined : maxId;
		const _untilId = FALLBACK_TO_OFFSET ? undefined : maxId;

		const { data, error } = await client.search.findPosts({
			maxId: _maxId,
			q,
			limit: 10,
			query: q,
			type: 'statuses',
			sort: sort, // for bluesky
			untilId: !!_untilId ? _untilId : undefined,
			offset,
		});
		if (error) {
			console.log('[WARN]: error searching for posts', error.message);
			throw new Error(error.message);
		}

		if (DriverService.supportsAtProto(driver)) {
			const _data = data as AppBskyFeedSearchPosts.Response;
			return {
				...defaultResultPage,
				maxId: _data.data.cursor,
				items: PostParser.parse<unknown[]>(_data.data.posts, driver, server),
			};
		}

		const _posts = PostParser.parse<unknown[]>(data as any[], driver, server);

		let __maxId = null;
		if (FALLBACK_TO_OFFSET) {
			try {
				__maxId = (parseInt(__maxId) + _posts.length).toString();
			} catch (e) {
				console.log(
					'[WARN]:could not generate post pagination token for certain drivers',
				);
			}
		} else {
			__maxId = data[_posts.length - 1].id;
		}

		return {
			maxId: __maxId,
			items: _posts,
			minId: null,
		};
	}

	return useQuery<PostResultPage>({
		queryKey: ['search/posts', server, q, maxId, sort],
		queryFn: api,
		enabled: client !== null && !!q,
		initialData: defaultResultPage,
	});
}
