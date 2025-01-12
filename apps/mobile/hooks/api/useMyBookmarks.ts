import { useQuery } from '@tanstack/react-query';
import { AppPostObject } from '../../types/app-post.types';
import { PostMiddleware } from '../../services/middlewares/post.middleware';
import { useAppApiClient } from '../utility/global-state-extractors';
import { AppSearchResultType } from '../../types/app.types';

function useMyBookmarks(maxId: string) {
	const { client, server, driver } = useAppApiClient();

	return useQuery<AppSearchResultType<AppPostObject>>({
		queryKey: [maxId],
		queryFn: async () => {
			if (!client) throw new Error('_client not initialized');
			const { data, error } = await client.accounts.bookmarks({
				limit: 5,
				maxId: maxId,
			});
			if (error) return { success: false, items: [], maxId: null, minId: null };

			return {
				success: true,
				items: PostMiddleware.deserialize<unknown[]>(
					data as any,
					driver,
					server,
				),
				maxId: null,
				minId: null,
			};
		},
		enabled: client !== null,
	});
}

export default useMyBookmarks;
