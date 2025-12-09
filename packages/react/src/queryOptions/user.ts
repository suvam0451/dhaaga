import type { AppBskyFeedGetAuthorFeed } from '@atproto/api';
import { queryOptions } from '@tanstack/react-query';
import {
	ActivityPubService,
	ApiTargetInterface,
	AtprotoApiAdapter,
	defaultResultPage,
	DriverService,
	DriverUserFindQueryType,
	MisskeyApiAdapter,
	PostParser,
} from '@dhaaga/bridge';
import type {
	PostObjectType,
	ResultPage,
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
		queryFn: () => client.user.findOne(query),
		enabled: !!client,
	});
}

export function userFollowsQueryOpts(
	client: ApiTargetInterface,
	userId: string,
	maxId: string | null,
) {
	return queryOptions({
		queryKey: ['dhaaga/user/follows', client.key, userId, maxId],
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

async function api(
	client: ApiTargetInterface,
	userId: string,
): Promise<ResultPage<PostObjectType[]>> {
	const result = await client.users.getPosts(userId, {
		limit: 10,
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

	const data = DriverService.supportsAtProto(client.driver)
		? PostParser.parse<unknown[]>(
				(result as AppBskyFeedGetAuthorFeed.Response).data.feed,
				client.driver,
				client.server!,
			).filter((o) => !o.meta.isReply)
		: PostParser.parse<unknown[]>(
				result as any[],
				client.driver,
				client.server!,
			);

	return {
		data,
	};
}

export function userGalleryQueryOpts(
	client: ApiTargetInterface,
	userId: string,
) {
	return queryOptions<ResultPage<PostObjectType[]>>({
		queryKey: [`dhaaga/profile/gallery`, userId],
		queryFn: () => api(client, userId),
		enabled: !!client && !!userId,
	});
}

export function userGetPinnedPosts(client: ApiTargetInterface, userId: string) {
	async function api() {
		/**
		 * Misskey returns pinned notes as part of
		 * UserDetailed object
		 */

		if (ActivityPubService.misskeyLike(client.driver)) {
			const { data, error } = await (client as MisskeyApiAdapter).users.get(
				userId,
			);
			if (error) throw new Error(error.message);
			const _data = data as any;
			return PostParser.parse<unknown[]>(
				_data.pinnedNotes,
				client.driver,
				client.server!,
			).slice(0, 10);
		} else if (ActivityPubService.blueskyLike(client.driver)) {
			return PostParser.parse<unknown[]>(
				await (client as AtprotoApiAdapter).users.getPinnedPosts(userId),
				client.driver,
				client.server!,
			).slice(0, 10);
		} else {
			const data = await client.users.getPosts(userId, {
				limit: 10,
				pinned: true,
				userId,
			});
			return PostParser.parse<unknown[]>(
				data as any,
				client.driver,
				client.server!,
			).slice(0, 10);
		}
	}

	// Post Queries
	return queryOptions<PostObjectType[]>({
		queryKey: ['dhaaga/user/pins', client.key, userId],
		queryFn: api,
		enabled: !!client && !!userId,
	});
}
