import {
	ActivityPubService,
	ApiTargetInterface,
	AtprotoApiAdapter,
	defaultResultPage,
	DriverService,
	type FeedObjectType,
	FeedParser,
	KNOWN_SOFTWARE,
	type PostObjectType,
	PostParser,
	type ResultPage,
	type UserObjectType,
	UserParser,
} from '@dhaaga/bridge';
import { queryOptions } from '@tanstack/react-query';
import type { AppBskyFeedSearchPosts } from '@atproto/api';

type PostResultPage = ResultPage<PostObjectType>;
type FeedResultPage = ResultPage<FeedObjectType>;

export function searchFeedsQueryOpts(
	client: AtprotoApiAdapter,
	driver: KNOWN_SOFTWARE,
	server: string,
	q: string,
	maxId?: string,
) {
	async function api(): Promise<FeedResultPage> {
		if (!q) return defaultResultPage;
		const { data, error } = await (
			client as AtprotoApiAdapter
		).search.findFeeds({
			limit: 5,
			query: q,
			cursor: maxId,
		});
		if (error) return defaultResultPage;
		return {
			...defaultResultPage,
			items: FeedParser.parse<unknown[]>(data.feeds, driver, server),
			maxId: data.cursor as any,
		};
	}

	return queryOptions<FeedResultPage>({
		queryKey: ['search/feeds', server, q, maxId],
		queryFn: api,
		enabled: !!client && DriverService.supportsAtProto(driver),
		initialData: defaultResultPage,
	});
}

export function searchPostsQueryOpts(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	server: string,
	q: string,
	maxId?: string,
	sort?: 'top' | 'latest',
) {
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
				__maxId = (parseInt(__maxId ?? '0') + _posts.length).toString();
			} catch (e) {
				console.log(
					'[WARN]:could not generate post pagination token for certain drivers',
				);
			}
		} else {
			// @ts-ignore-next-line
			__maxId = data[_posts.length - 1].id;
		}

		return {
			maxId: __maxId,
			items: _posts,
			minId: null,
		};
	}

	return queryOptions<PostResultPage>({
		queryKey: ['search/posts', server, q, maxId, sort],
		queryFn: api,
		enabled: client !== null && !!q,
		initialData: defaultResultPage,
	});
}

export function searchUsersQueryOpts(
	client: AtprotoApiAdapter,
	driver: KNOWN_SOFTWARE,
	server: string,
	q: string,
	maxId?: string,
) {
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
		if (ActivityPubService.blueskyLike(driver)) {
			return UserParser.parse<unknown[]>(
				(data as any).data.actors as any[],
				driver,
				server,
			);
		} else {
			return UserParser.parse<unknown[]>(
				data as unknown as any[],
				driver,
				server,
			);
		}
	}

	return queryOptions<UserObjectType[]>({
		queryKey: ['search/users', server, q, maxId],
		queryFn: api,
		enabled: client !== null && !!q,
		initialData: [],
	});
}
