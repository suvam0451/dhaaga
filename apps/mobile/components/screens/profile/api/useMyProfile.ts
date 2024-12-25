import { useQuery } from '@tanstack/react-query';
import { AppUserObject } from '../../../../types/app-user.types';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { UserMiddleware } from '../../../../services/middlewares/user.middleware';

function useMyProfile() {
	const { client, acct } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			acct: o.acct,
		})),
	);

	async function api(): Promise<AppUserObject> {
		if (!client) return null;
		const { data, error } = await client.accounts.get(acct.identifier);
		if (error) return null;
		return UserMiddleware.deserialize(data, acct?.driver, acct?.server);
	}

	// Queries
	return useQuery({
		queryKey: ['user', acct],
		queryFn: api,
		enabled: client !== null && acct !== null,
		initialData: null,
	});
}

export default useMyProfile;
