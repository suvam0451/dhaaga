import { useQuery } from '@tanstack/react-query';
import {
	useAccountManager,
	useAppAcct,
	useAppApiClient,
} from './utility/global-state-extractors';
import { UserParser } from '@dhaaga/bridge';
import type { UserObjectType } from '@dhaaga/bridge';

/**
 * Gets the user's account and
 * serializes the user object onto
 * the cache with fixed expiry
 */
function useApiMe() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();
	const { acctManager } = useAccountManager();

	// Queries
	return useQuery<UserObjectType>({
		queryKey: ['dhaaga/user/me', acct?.id],
		queryFn: async () => {
			const data = await client.me.getMe();
			const _value = UserParser.parse(data, driver, server);
			if (acctManager) acctManager.storage.setProfile(acct?.uuid, _value);
			return _value;
		},
		enabled: !!client && !!acct,
		initialData: acctManager?.storage?.getProfile(acct?.uuid)?.value,
	});
}

export default useApiMe;
