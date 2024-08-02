import { useQuery } from '@tanstack/react-query';
import {
	MastoStatus,
	MegaStatus,
} from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';

function useMyBookmarks(maxId: string) {
	const { client } = useActivityPubRestClientContext();

	async function api(): Promise<{
		data: MastoStatus[] | MegaStatus[];
		minId?: string;
		maxId?: string;
	}> {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.bookmarks.get({
			limit: 5,
			maxId: maxId,
		});
		if (error) {
			return { data: [], maxId: null, minId: null };
		}
		return data as any;
	}

	return useQuery<{
		data: MastoStatus[] | MegaStatus[];
		minId?: string;
		maxId?: string;
	}>({
		queryKey: [maxId],
		queryFn: api,
		enabled: client !== null,
	});
}

export default useMyBookmarks;
