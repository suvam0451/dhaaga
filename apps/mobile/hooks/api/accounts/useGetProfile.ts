import { useQuery } from '@tanstack/react-query';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { AppUserObject } from '../../../types/app-user.types';
import BlueskyRestClient from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/bluesky';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { UserMiddleware } from '../../../services/middlewares/user.middleware';

type Type = {
	userId?: string;
	handle?: string;
};

/**
 * GET user profile
 * @param user an existing user interface
 * @param userId userId to query against
 */
function useGetProfile({ userId, handle }: Type) {
	const { client, driver, acct } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			client: o.router,
			acct: o.acct,
		})),
	);

	async function api(): Promise<AppUserObject> {
		if (!client || (!userId && !handle)) {
			return null;
		}
		if (userId) {
			const { data, error } = await client.accounts.get(userId);
			if (error) throw new Error('Failed to fetch user for AtpProto');
			return UserMiddleware.deserialize(data, driver, acct?.server);
		} else if (handle) {
			if (driver === KNOWN_SOFTWARE.BLUESKY) {
				// fetch did for handle
				const { data: didData, error: didError } = await (
					client as BlueskyRestClient
				).accounts.getDid(handle);
				if (didError) throw new Error('Failed to fetch did');

				// fetch account for did
				const { data, error } = await client.accounts.get(didData.data.did);
				if (error) throw new Error('Failed to fetch user for AtProto');
				return UserMiddleware.deserialize(data.data, driver, acct?.server);
			}
		}
	}

	// Queries
	return useQuery<AppUserObject>({
		queryKey: ['profile', userId, handle],
		queryFn: api,
		enabled: client !== undefined && client !== null,
		initialData: null,
	});
}

export default useGetProfile;
