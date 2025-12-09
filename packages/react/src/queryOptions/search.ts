import {
	ApiTargetInterface,
	AtprotoApiAdapter,
	defaultResultPage,
	DriverService,
	FeedParser,
	KNOWN_SOFTWARE,
	PostParser,
	UserParser,
} from '@dhaaga/bridge';
import type {
	UserObjectType,
	PostObjectType,
	FeedObjectType,
	ResultPage,
} from '@dhaaga/bridge';
import { queryOptions } from '@tanstack/react-query';

type PostResultPage = ResultPage<PostObjectType[]>;
type FeedResultPage = ResultPage<FeedObjectType[]>;

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
			data: FeedParser.parse<unknown[]>(data.feeds, driver, server),
			maxId: data.cursor as any,
		};
	}

	return queryOptions<FeedResultPage>({
		queryKey: ['search/feeds', server, q, maxId],
		queryFn: api,
		enabled: !!client && DriverService.supportsAtProto(driver),
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

		const data = await client.search.findPosts({
			maxId: _maxId,
			q,
			limit: 10,
			query: q,
			type: 'statuses',
			sort: sort, // for bluesky
			untilId: !!_untilId ? _untilId : undefined,
			offset,
		});

		if (DriverService.supportsAtProto(driver)) {
			const _data = data;
			return {
				...defaultResultPage,
				maxId: _data.maxId,
				data: PostParser.parse<unknown[]>(_data.data, driver, server),
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
			data: _posts,
			maxId: __maxId,
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
	client: ApiTargetInterface,
	acctIdentifier: string,
	defaultTo: 'auto' | 'followings' | 'suggested',
	q: string,
	maxId?: string,
) {
	async function api(): Promise<UserObjectType[]> {
		// TODO: if q is empty, find us a list of recommended users
		const data = await client.search.findUsers({
			maxId,
			q,
			limit: 10,
			query: q,
			type: 'accounts',
			untilId: maxId,
		});
		if (DriverService.supportsAtProto(client.driver)) {
			return UserParser.parse<unknown[]>(
				data.data,
				client.driver,
				client.server!,
			);
		} else {
			return UserParser.parse<unknown[]>(
				data.data,
				client.driver,
				client.server!,
			);
		}
	}

	return queryOptions<UserObjectType[]>({
		queryKey: ['dhaaga/search/users', acctIdentifier, q, maxId],
		queryFn: api,
		enabled: !!client,
		initialData: [],
	});
}
