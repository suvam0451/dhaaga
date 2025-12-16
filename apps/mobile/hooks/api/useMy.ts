import { userFollowersQueryOpts, userFollowsQueryOpts } from '@dhaaga/react';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { useQuery } from '@tanstack/react-query';
import { AtprotoApiAdapter } from '@dhaaga/bridge';

export function useApiGetMyFollowers(maxId: string | null) {
	const { client } = useAppApiClient();
	const { me } = useActiveUserSession();
	return useQuery(userFollowersQueryOpts(client, me.id, null));
}

export function useApiGetMyFollowings(maxId: string | null) {
	const { client } = useAppApiClient();
	const { me } = useActiveUserSession();
	return useQuery(userFollowsQueryOpts(client, me.id, null));
}

/**
 * atproto only
 */
export function useApiGetMyUserPreferences(forced: boolean = false) {
	const { client } = useAppApiClient();
	const { acctManager, acct } = useActiveUserSession();

	async function api() {
		// prefer using cache (unless forced to refresh)
		if (!forced) {
			const cached = acctManager.storage.getAtProtoUserPreferences(acct);
			if (cached) return cached;
		}
		const data = await (client as AtprotoApiAdapter).me.getPreferences();
		acctManager.storage.setAtProtoUserPreferences(acct, data);
		return data;
	}

	return useQuery({
		queryKey: ['dhaaga/me/atproto-preferences', client.key],
		queryFn: api,
	});
}
