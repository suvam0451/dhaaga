import { userFollowersQueryOpts, userFollowsQueryOpts } from '@dhaaga/react';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { useQuery } from '@tanstack/react-query';

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
