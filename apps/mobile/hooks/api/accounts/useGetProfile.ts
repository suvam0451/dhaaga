import { useQuery } from '@tanstack/react-query';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppUserObject } from '../../../types/app-user.types';
import { UserMiddleware } from '../../../services/middlewares/user.middleware';
import {
	useAppAcct,
	useAppApiClient,
} from '../../utility/global-state-extractors';

type Type = {
	userId?: string;
};

/**
 * GET user profile
 * @param user an existing user interface
 * @param userId userId to query against
 */
function useGetProfile({ userId }: Type) {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();

	async function api(): Promise<AppUserObject> {
		if (!client || !userId) throw new Error('E_No_Client');

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			// fetch did for handle (not needed, if regex check passes)
			// const { data: didData, error: didError } = await (
			// 	client as BlueskyRestClient
			// ).accounts.getDid(userId);
			// if (didError) throw new Error('Failed to fetch did');

			// fetch account for did
			const { data, error } = await client.accounts.get(userId);
			if (error) throw new Error('Failed to fetch user for AtProto');
			return UserMiddleware.deserialize(data.data, driver, server);
		}

		const { data, error } = await client.accounts.get(userId);
		if (error) throw new Error('Failed to fetch user for AtpProto');
		return UserMiddleware.deserialize(data, driver, server);
	}

	// Queries
	return useQuery<AppUserObject>({
		queryKey: ['profile', acct?.id, userId],
		queryFn: api,
		enabled: client !== undefined && client !== null,
		initialData: null,
	});
}

export default useGetProfile;
