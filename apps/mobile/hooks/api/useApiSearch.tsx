import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '../utility/global-state-extractors';
import { AppPostObject } from '../../types/app-post.types';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { PostMiddleware } from '../../services/middlewares/post.middleware';
import { UserMiddleware } from '../../services/middlewares/user.middleware';
import { AppUserObject } from '../../types/app-user.types';
import { AppBskyFeedSearchPosts } from '@atproto/api';

export function useApiSearchUsers(q: string, maxId: string | null) {
	const { client, server, driver } = useAppApiClient();

	async function api(): Promise<AppUserObject[]> {
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
		return UserMiddleware.deserialize<unknown[]>(data as any[], driver, server);
	}

	return useQuery<AppUserObject[]>({
		queryKey: ['search/users', server, q, maxId],
		queryFn: api,
		enabled: client !== null && !!q,
		initialData: [],
	});
}

type PostResults = {
	items: AppPostObject[];
	maxId: string | null;
	minId: string | null;
	success: boolean;
};

export function useApiSearchPosts(q: string, maxId: string | null) {
	const { client, server, driver } = useAppApiClient();

	async function api(): Promise<PostResults> {
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
			// for misskey
			untilId: !!_untilId ? _untilId : undefined,
			offset,
		});
		if (error) {
			console.log('[WARN]: error searching for posts', error.message);
			throw new Error(error.message);
		}

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			const _data = data as AppBskyFeedSearchPosts.Response;
			return {
				maxId: _data.data.cursor,
				items: PostMiddleware.deserialize<unknown[]>(
					_data.data.posts,
					driver,
					server,
				),
				minId: null,
				success: true,
			};
		}

		const _posts = PostMiddleware.deserialize<unknown[]>(
			data as any[],
			driver,
			server,
		);

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
			success: true,
		};
	}

	return useQuery<PostResults>({
		queryKey: ['search/posts', server, q, maxId],
		queryFn: api,
		enabled: client !== null && !!q,
		initialData: { maxId: null, minId: null, items: [], success: false },
	});
}
