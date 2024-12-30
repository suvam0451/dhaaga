import { useQuery } from '@tanstack/react-query';
import { AppUserObject } from '../../../types/app-user.types';
import { UserMiddleware } from '../../../services/middlewares/user.middleware';
import {
	useAppAcct,
	useAppApiClient,
} from '../../utility/global-state-extractors';

function useApiGetMyAccount() {
	const { client } = useAppApiClient();
	const { acct } = useAppAcct();

	async function api(): Promise<AppUserObject> {
		if (!client) return null;
		const { data, error } = await client.accounts.get(acct.identifier);
		if (error) return null;
		return UserMiddleware.deserialize(data, acct?.driver, acct?.server);
	}

	// Queries
	return useQuery({
		queryKey: ['user/me', acct?.id],
		queryFn: api,
		enabled: client !== null && acct !== null,
		initialData: null,
	});
}

export default useApiGetMyAccount;
