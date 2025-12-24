import { queryOptions } from '@tanstack/react-query';
import {
	ActivitypubHelper,
	ActivityPubService,
	ApiTargetInterface,
	AtprotoApiAdapter,
	DriverService,
	DriverUserFindQueryType,
	MisskeyApiAdapter,
	PostParser,
	UserParser,
} from '@dhaaga/bridge';
import type {
	PostObjectType,
	ResultPage,
	UserObjectType,
} from '@dhaaga/bridge';
import { unifiedUserLookup } from '@dhaaga/bridge';

/**
 * GET user profile
 */
export function userProfileQueryOpts(
	client: ApiTargetInterface,
	query: DriverUserFindQueryType,
) {
	async function api() {
		if (query.use === 'handle') {
			if (DriverService.supportsAtProto(client.driver)) {
				query = { use: 'handle', handle: query.handle.replace(/^@/, '') };
			} else {
				const webfinger = ActivitypubHelper.splitHandle(
					query.handle,
					client.server!,
				);
				if (!webfinger)
					throw new Error(
						`failed to resolve webfinger from handle -> ${query.handle}`,
					);
				query = { use: 'webfinger', webfinger };
			}
		}
		return unifiedUserLookup(client, query);
	}
	return queryOptions<UserObjectType>({
		queryKey: [client.key, 'dhaaga/user', query],
		queryFn: api,
		enabled: !!client && !!query,
	});
}

export function userFollowsQueryOpts(
	client: ApiTargetInterface,
	userId: string,
	maxId: string | null,
) {
	async function api(): Promise<ResultPage<UserObjectType[]>> {
		const data = await client.users.getFollowings({
			id: userId,
			limit: 15,
			maxId,
			allowPartial: true,
		});
		return {
			...data,
			data: UserParser.parse<unknown[]>(
				data.data,
				client.driver,
				client.server!,
			),
		};
	}
	return queryOptions<ResultPage<UserObjectType[]>>({
		queryKey: ['dhaaga/user/follows', client.key, userId, maxId],
		queryFn: api,
		enabled: !!client,
	});
}

export function userFollowersQueryOpts(
	client: ApiTargetInterface,
	acctId: string,
	maxId: string | null,
) {
	async function api() {
		const data = await client.users.getFollowers({
			id: acctId,
			limit: 10,
			maxId,
			allowPartial: true,
		});

		return {
			...data,
			data: UserParser.parse<unknown[]>(
				data.data,
				client.driver,
				client.server!,
			),
		};
	}

	return queryOptions<ResultPage<UserObjectType[]>>({
		queryKey: [client.key, 'dhaaga/user/followers', acctId, maxId],
		queryFn: api,
		enabled: !!client,
	});
}

export function userGalleryQueryOpts(
	client: ApiTargetInterface,
	userId: string,
	maxId: string | null,
) {
	async function api(): Promise<ResultPage<PostObjectType[]>> {
		const result = await client.users.getPosts(userId, {
			limit: 40,
			userId,
			onlyMedia: true,
			excludeReplies: true,
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
			maxId,
			untilId: maxId === null ? undefined : maxId,
		});

		const data = DriverService.supportsAtProto(client.driver)
			? PostParser.parse<unknown[]>(
					result.data.map((o: any) => o.post),
					client.driver,
					client.server!,
				)
			: PostParser.parse<unknown[]>(
					result.data as any[],
					client.driver,
					client.server!,
				);

		return {
			data,
		};
	}

	return queryOptions<ResultPage<PostObjectType[]>>({
		queryKey: [`dhaaga/profile/gallery`, userId, maxId],
		queryFn: api,
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
			const data = await (client as MisskeyApiAdapter).users.get(userId);
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
