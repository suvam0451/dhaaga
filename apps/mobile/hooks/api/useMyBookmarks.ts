import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '../utility/global-state-extractors';
import { AppResultPageType } from '../../types/app.types';
import { PostParser } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge/typings';

function useMyBookmarks(maxId: string) {
	const { client, server, driver } = useAppApiClient();

	return useQuery<AppResultPageType<PostObjectType>>({
		queryKey: [maxId],
		queryFn: async () => {
			if (!client) throw new Error('_client not initialized');
			const { data, error } = await client.accounts.bookmarks({
				limit: 20,
				maxId: maxId,
			});
			if (error) return { success: false, items: [], maxId: null, minId: null };

			return {
				success: true,
				items: PostParser.parse<unknown[]>(data as any, driver, server),
				maxId: null,
				minId: null,
			};
		},
		enabled: client !== null,
	});
}

export default useMyBookmarks;
