import { useQuery } from '@tanstack/react-query';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import type {
	FeedObjectType,
	ResultPage,
	UserObjectType,
} from '@dhaaga/bridge';
import { AtprotoApiAdapter, DriverService } from '@dhaaga/bridge';
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
			return (client as AtprotoApiAdapter).search.findFeeds({
				limit: 5,
				query: q,
				cursor: maxId,
			});
		},
		enabled: !!client && DriverService.supportsAtProto(driver),
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
	const { acct } = useActiveUserSession();
	return useQuery<UserObjectType[]>(
		searchUsersQueryOpts(client, acct.identifier, defaultTo, q, maxId),
	);
}
