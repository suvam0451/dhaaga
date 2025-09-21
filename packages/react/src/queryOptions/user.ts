import { queryOptions } from '@tanstack/react-query';
import {
	ApiTargetInterface,
	defaultResultPage,
	DriverUserFindQueryType,
	UserObjectType,
} from '@dhaaga/bridge';

/**
 * GET user profile
 */
export function userProfileQueryOpts(
	client: ApiTargetInterface,
	query: DriverUserFindQueryType,
) {
	return queryOptions<UserObjectType>({
		queryKey: [client.key, 'dhaaga/user', query],
		queryFn: () => client.user.findOne(query).then((o) => o.unwrap()),
		enabled: !!client,
	});
}

export function userFollowsQueryOpts(
	client: ApiTargetInterface,
	userId: string,
	maxId: string | null,
) {
	return queryOptions({
		queryKey: [client.key, 'dhaaga/user/follows', maxId],
		queryFn: () =>
			client.user
				.getFollows({
					id: userId,
					limit: 10,
					maxId,
					allowPartial: true,
				})
				.then((o) => o.unwrapOrElse(defaultResultPage)),
		enabled: !!client,
		initialData: defaultResultPage,
	});
}

export function userFollowersQueryOpts(
	client: ApiTargetInterface,
	acctId: string,
	maxId: string | null,
) {
	return queryOptions({
		queryKey: [client.key, 'dhaaga/user/followers', acctId, maxId],
		queryFn: () =>
			client.user
				.getFollowers({
					id: acctId,
					limit: 10,
					maxId,
					allowPartial: true,
				})
				.then((o) => o.unwrapOrElse(defaultResultPage)),
		enabled: !!client,
		initialData: defaultResultPage,
	});
}
