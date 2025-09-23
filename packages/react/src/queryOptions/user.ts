import type { AppBskyFeedGetAuthorFeed } from '@atproto/api';
import { queryOptions } from '@tanstack/react-query';
import {
	ApiTargetInterface,
	defaultResultPage,
	DriverService,
	DriverUserFindQueryType,
	type PostObjectType,
	PostParser,
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

async function api(client: ApiTargetInterface, userId: string) {
	const result = await client.accounts.statuses(userId, {
		limit: 40,
		userId,
		onlyMedia: true,
		excludeReblogs: true,
		// misskey
		allowPartial: true,
		withFiles: true,
		withRenotes: false,
		withReplies: false,
		// bluesky
		bskyFilter: DriverService.supportsAtProto(client.driver)
			? 'posts_with_media'
			: undefined,
	});

	if (!result.isOk()) return [];
	const data = result.unwrap();

	return DriverService.supportsAtProto(client.driver)
		? PostParser.parse<unknown[]>(
				(data as AppBskyFeedGetAuthorFeed.Response).data.feed,
				client.driver,
				client.server!,
			).filter((o) => !o.meta.isReply)
		: PostParser.parse<unknown[]>(data as any[], client.driver, client.server!);
}

export function userGalleryQueryOpts(
	client: ApiTargetInterface,
	userId: string,
) {
	return queryOptions<PostObjectType[]>({
		queryKey: [`dhaaga/profile/gallery`, userId],
		queryFn: () => api(client, userId),
		enabled: !!client && !!userId,
		initialData: [],
	});
}
