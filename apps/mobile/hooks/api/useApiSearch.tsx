import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '../utility/global-state-extractors';
import { AppPostObject } from '../../types/app-post.types';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { PostMiddleware } from '../../services/middlewares/post.middleware';

export function useApiSearchPosts(q: string, maxId: string | null) {
	const { client, server, driver } = useAppApiClient();

	async function api(): Promise<AppPostObject[]> {
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
			untilId: _untilId,
			offset,
		});
		console.log(data, error);
		if (error) {
			console.log('[WARN]: error searching for posts', error.message);
			throw new Error(error.message);
		}

		console.log(data);
		return PostMiddleware.deserialize<unknown[]>(data, driver, server);
	}

	return useQuery<AppPostObject[]>({
		queryKey: ['search/posts', server, q],
		queryFn: api,
		enabled: client !== null && !!q,
		initialData: [],
	});
}
