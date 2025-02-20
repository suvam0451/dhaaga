import { useQuery } from '@tanstack/react-query';
import {
	KNOWN_SOFTWARE,
	MastodonRestClient,
	MisskeyRestClient,
} from '@dhaaga/bridge';
import {
	useAppAcct,
	useAppApiClient,
} from '../../../hooks/utility/global-state-extractors';
import ActivityPubService from '../../../services/activitypub.service';
import { UserObjectType, UserParser } from '@dhaaga/core';

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

	async function api(): Promise<UserObjectType> {
		if (!client || query === null) throw new Error('E_No_Client');
		const { did, userId, webfinger } = query;

		if (!did && !userId && !webfinger) return null;

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			// fetch did for handle (not needed, if regex check passes)
			// const { data: didData, error: didError } = await (
			// 	client as BlueskyRestClient
			// ).accounts.getDid(userId);
			// if (didError) throw new Error('Failed to fetch did');

			// fetch account for did
			const { data, error } = await client.accounts.get(did);
			if (error) throw new Error('Failed to fetch user for AtProto');
			return UserParser.parse(data.data, driver, server);
		}

		if (ActivityPubService.misskeyLike(driver)) {
			if (userId) {
				const findResult = await (
					client as MisskeyRestClient
				).accounts.findByUserId(userId);
				return UserParser.parse<unknown>(findResult.data, driver, server);
			} else if (webfinger) {
				const findResult = await (
					client as MisskeyRestClient
				).accounts.findByWebfinger(webfinger);
				return UserParser.parse<unknown>(findResult.data, driver, server);
			}
		}

		if (ActivityPubService.mastodonLike(driver)) {
			if (userId) {
				const findResult = await client.accounts.get(userId);
				if (findResult.error)
					throw new Error('Failed to fetch user for Mastodon');
				return UserParser.parse(findResult.data, driver, server);
			} else if (webfinger) {
				const findResult = await (client as MastodonRestClient).accounts.lookup(
					webfinger.host
						? `${webfinger.username}@${webfinger.host}`
						: webfinger.username,
				);
				if (findResult.error)
					throw new Error('Failed to fetch user for Mastodon');
				return UserParser.parse(findResult.data, driver, server);
			}
		}
	}

	// Queries
	return useQuery<UserObjectType>({
		queryKey: ['profile', acct, query],
		queryFn: api,
		enabled: !!client,
		initialData: null,
	});
}

export default useGetProfile;
