import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '../utility/global-state-extractors';
import {
	UserParser,
	DriverService,
	defaultResultPage,
	FeedParser,
	AtprotoApiAdapter,
	ActivityPubService,
} from '@dhaaga/bridge';
import type {
	UserObjectType,
	FeedObjectType,
	ResultPage,
} from '@dhaaga/bridge';

type FeedResultPage = ResultPage<FeedObjectType[]>;

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
		if (ActivityPubService.blueskyLike(driver)) {
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
