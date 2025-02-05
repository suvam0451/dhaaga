import { useQuery } from '@tanstack/react-query';
import { KNOWN_SOFTWARE, MisskeyRestClient } from '@dhaaga/bridge';
import { AppUserObject } from '../../../types/app-user.types';
import { UserMiddleware } from '../../../services/middlewares/user.middleware';
import {
	useAppAcct,
	useAppApiClient,
} from '../../../hooks/utility/global-state-extractors';
import ActivityPubService from '../../../services/activitypub.service';

export type ProfileSearchQueryType = {
	did?: string;
	userId?: string;
	webfinger?: {
		username: string;
		host: string | null;
	};
};

/**
 * GET user profile
 */
function useGetProfile(query: ProfileSearchQueryType) {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();

	async function api(): Promise<AppUserObject> {
		if (!client || query === null) throw new Error('E_No_Client');
		const { did, userId, webfinger } = query;

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			// fetch did for handle (not needed, if regex check passes)
			// const { data: didData, error: didError } = await (
			// 	client as BlueskyRestClient
			// ).accounts.getDid(userId);
			// if (didError) throw new Error('Failed to fetch did');

			// fetch account for did
			const { data, error } = await client.accounts.get(did);
			if (error) throw new Error('Failed to fetch user for AtProto');
			return UserMiddleware.deserialize(data.data, driver, server);
		}

		if (ActivityPubService.misskeyLike(driver)) {
			if (userId) {
				const findResult = await (
					client as MisskeyRestClient
				).accounts.findByUserId(userId);
				return UserMiddleware.deserialize<unknown>(
					findResult.data,
					driver,
					server,
				);
			} else if (webfinger) {
				const findResult = await (
					client as MisskeyRestClient
				).accounts.findByWebfinger(webfinger);
				return UserMiddleware.deserialize<unknown>(
					findResult.data,
					driver,
					server,
				);
			}
		}

		const { data, error } = await client.accounts.get(userId);
		if (error) throw new Error('Failed to fetch user for AtpProto');
		return UserMiddleware.deserialize(data, driver, server);
	}

	// Queries
	return useQuery<AppUserObject>({
		queryKey: ['profile', acct, query],
		queryFn: api,
		enabled: !!client,
		initialData: null,
	});
}

export default useGetProfile;
