import { useQuery } from '@tanstack/react-query';
import {
	useAppAcct,
	useAppApiClient,
} from '../utility/global-state-extractors';
import {
	DriverService,
	defaultResultPage,
	FeedParser,
	AtprotoApiAdapter,
} from '@dhaaga/bridge';
import type {
	UserObjectType,
	FeedObjectType,
	ResultPage,
} from '@dhaaga/bridge';
import { searchUsersQueryOpts } from '@dhaaga/react';

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
 * @param defaultTo
 * @param q query
 * @param maxId cursor
 */
export function useApiSearchUsers(
	defaultTo: 'auto' | 'followings' | 'suggested',
	q: string,
	maxId: string | null,
) {
	const { client } = useAppApiClient();
	const { acct } = useAppAcct();
	return useQuery<UserObjectType[]>(
		searchUsersQueryOpts(client, acct.identifier, defaultTo, q, maxId),
	);
}
