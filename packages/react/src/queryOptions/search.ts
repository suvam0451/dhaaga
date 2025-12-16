import {
	AtprotoApiAdapter,
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
	ApiTargetInterface,
} from '@dhaaga/bridge';
import { queryOptions } from '@tanstack/react-query';

type PostResultPage = ResultPage<PostObjectType[]>;
type FeedResultPage = ResultPage<FeedObjectType[]>;

export function searchFeedsQueryOpts(
	client: ApiTargetInterface,
	q: string,
	maxId?: string,
) {
	async function api(): Promise<FeedResultPage> {
		const data = await (client as AtprotoApiAdapter).search.findFeeds({
			limit: 15,
			query: q,
			cursor: maxId,
		});
		return {
			data: FeedParser.parse<unknown[]>(
				data.data,
				client.driver,
				client.server!,
			),
			maxId: data.maxId,
		};
	}

	return queryOptions<FeedResultPage>({
		queryKey: ['dhaaga/search/feeds', client?.key, q, maxId],
		queryFn: api,
		enabled: !!client && DriverService.supportsAtProto(client?.driver),
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
				maxId: _data.maxId,
				data: PostParser.parse<unknown[]>(_data.data as any, driver, server),
			};
		}

		/**
		 * ActivityPub shenanigans -_-
		 */

		const _posts = PostParser.parse<unknown[]>(data.data, driver, server);

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
			__maxId = _posts[_posts.length - 1].id;
		}

		return {
			data: _posts,
			maxId: __maxId,
			minId: null,
		};
	}

	return queryOptions<PostResultPage>({
		queryKey: ['dhaaga/search/posts', server, q, maxId, sort],
		queryFn: api,
		enabled: client !== null && !!q,
	});
}

export function searchUsersQueryOpts(
	client: ApiTargetInterface,
	q: string,
	maxId?: string,
) {
	async function api(): Promise<ResultPage<UserObjectType[]>> {
		// TODO: if q is empty, find us a list of recommended users
		const data = await client.search.findUsers({
			maxId,
			q,
			limit: 10,
			query: q,
			type: 'accounts',
			untilId: maxId,
		});
		return {
			data: UserParser.parse<unknown[]>(
				data.data,
				client.driver,
				client.server!,
			),
		};
	}

	return queryOptions<ResultPage<UserObjectType[]>>({
		queryKey: ['dhaaga/search/users', client?.key, q, maxId],
		queryFn: api,
		enabled: !!client,
	});
}
