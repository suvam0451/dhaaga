import { useQuery } from '@tanstack/react-query';
import { AppUserObject } from '../../../types/app-user.types';
import { UserMiddleware } from '../../../services/middlewares/user.middleware';
import {
	useAccountManager,
	useAppAcct,
	useAppApiClient,
} from '../../utility/global-state-extractors';

function useApiGetMyAccount() {
	const { client } = useAppApiClient();
	const { acct } = useAppAcct();
	const { acctManager } = useAccountManager();

	async function api(): Promise<AppUserObject> {
		if (!client) return null;
		const { data, error } = await client.accounts.get(acct.identifier);
		if (error) return null;
		const _value = UserMiddleware.deserialize(data, acct?.driver, acct?.server);
		acctManager.storage.setProfile(acct?.uuid, _value);
		return UserMiddleware.deserialize(data, acct?.driver, acct?.server);
	}

	// Queries
	return useQuery({
		queryKey: ['user/me', acct?.id],
		queryFn: api,
		enabled: client !== null && acct !== null,
		initialData: acctManager.storage.getProfile(acct?.uuid)?.value,
	});
}

export default useApiGetMyAccount;
