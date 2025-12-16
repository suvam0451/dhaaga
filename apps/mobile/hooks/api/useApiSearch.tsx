import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '#/states/global/hooks';
import {
	searchFeedsQueryOpts,
	searchPostsQueryOpts,
	searchUsersQueryOpts,
} from '@dhaaga/react';

/**
 * Search and paginate through for posts
 * @param q query
 * @param maxId cursor
 * @param sort applies to atproto only
 */
export function useApiSearchPosts(
	q: string,
	maxId: string | null,
	sort?: 'top' | 'latest',
) {
	const { client, driver, server } = useAppApiClient();
	return useQuery(searchPostsQueryOpts(client, driver, server, q, maxId, sort));
}

/**
 * Search and paginate through for users
 * @param q query
 * @param maxId cursor
 */
export function useApiSearchUsers(q: string, maxId: string | null) {
	const { client } = useAppApiClient();
	return useQuery(searchUsersQueryOpts(client, q, maxId));
}

/**
 * Search and paginate through for feeds
 * @param q query
 * @param maxId cursor
 */
export function useApiSearchFeeds(q: string, maxId: string | null) {
	const { client } = useAppApiClient();
	return useQuery(searchFeedsQueryOpts(client, q, maxId));
}
