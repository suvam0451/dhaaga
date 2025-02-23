import { useQuery } from '@tanstack/react-query';
import {
	useAccountManager,
	useAppAcct,
	useAppApiClient,
} from '../../utility/global-state-extractors';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppBskyActorGetProfile } from '@atproto/api';
import { UserParser } from '@dhaaga/bridge';
import type { UserObjectType } from '@dhaaga/bridge';

/**
 * Gets the user's account, and
 * serializes the user object onto
 * the cache with a fixed expiry
 */
function useApiGetMyAccount() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();
	const { acctManager } = useAccountManager();

	// Queries
	return useQuery<UserObjectType>({
		queryKey: ['user/me', acct?.id],
		queryFn: async () => {
			if (!client) return null;
			const { data, error } = await client.accounts.get(acct.identifier);
			if (error) return null;
			if (driver === KNOWN_SOFTWARE.BLUESKY) {
				const _data = data as AppBskyActorGetProfile.Response;
				const _value = UserParser.parse(_data.data, driver, server);
				if (acctManager) acctManager.storage.setProfile(acct?.uuid, _value);
				return _value;
			}
			const _value = UserParser.parse(data, driver, server);
			if (acctManager) acctManager.storage.setProfile(acct?.uuid, _value);
			return _value;
		},
		enabled: client !== null && acct !== null,
		initialData: acctManager?.storage?.getProfile(acct?.uuid)?.value,
	});
}

export default useApiGetMyAccount;
