import { useQuery } from '@tanstack/react-query';
import type { DriverUserFindQueryType } from '@dhaaga/bridge';
import {
	useAppAcct,
	useAppApiClient,
} from '../../../hooks/utility/global-state-extractors';
import { UserObjectType } from '@dhaaga/bridge';

/**
 * GET user profile
 */
function useGetProfile(query: DriverUserFindQueryType) {
	const { client } = useAppApiClient();
	const { acct } = useAppAcct();

	// Queries
	return useQuery<UserObjectType>({
		queryKey: ['profile', acct.uuid, query],
		queryFn: () => client.user.findOne(query).then((o) => o.unwrapOrElse(null)),
		enabled: !!client,
		initialData: null,
	});
}

export default useGetProfile;
