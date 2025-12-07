import { useQuery } from '@tanstack/react-query';
import {
	ActivityPubTagAdapter,
	KNOWN_SOFTWARE,
	TagTargetInterface,
} from '@dhaaga/bridge';
import {
	useAppAcct,
	useAppApiClient,
} from '../utility/global-state-extractors';

export function useApiGetTagInterface(query: string) {
	const { client, driver } = useAppApiClient();
	const { acct } = useAppAcct();

	// Queries
	return useQuery<TagTargetInterface>({
		queryKey: ['dhaaga/tag', acct.identifier, query],
		queryFn: async () => {
			if (driver === KNOWN_SOFTWARE.BLUESKY)
				return ActivityPubTagAdapter(query, driver);
			const { data, error } = await client.tags.get(query);
			if (error) throw new Error('E_Error_Fetching_Tag');
			return ActivityPubTagAdapter(data, driver);
		},
		enabled: !!client && !!query,
		initialData: null,
	});
}
