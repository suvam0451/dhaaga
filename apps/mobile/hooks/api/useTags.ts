import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubTagAdapter,
	KNOWN_SOFTWARE,
	TagInterface,
} from '@dhaaga/bridge';
import { useAppApiClient } from '../utility/global-state-extractors';

export function useApiGetTagInterface(query: string) {
	const { client, driver } = useAppApiClient();

	async function api() {
		if (driver === KNOWN_SOFTWARE.BLUESKY)
			return ActivityPubTagAdapter(query, driver);
		if (!client) throw new Error('E_No_Client');
		const { data, error } = await client.tags.get(query);
		if (error) throw new Error('E_Error_Fetching_Tag');
		return ActivityPubTagAdapter(data, driver);
	}

	// Queries
	return useQuery<TagInterface>({
		queryKey: ['tag', query],
		queryFn: api,
		enabled: client !== null && query !== null,
		initialData: null,
	});
}
