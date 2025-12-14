import { AccountRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import {
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
	FollowPostDto,
	GetPostsQueryDTO,
} from '../../typings.js';
import FetchWrapper from '#/client/utils/fetch.js';
import type {
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoRelationship,
} from '#/types/mastojs.types.js';
import { MissUserDetailed } from '#/types/misskey-js.types.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';
import { errorBuilder } from '#/types/index.js';
import { ApiErrorCode, PaginatedPromise } from '#/types/api-response.js';

export class MisskeyAccountsRouter implements AccountRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async getPosts(
		id: string,
		query: AccountRouteStatusQueryDto,
	): PaginatedPromise<Endpoints['users/notes']['res']> {
		const data = await this.client.client.request<
			'users/notes',
			Endpoints['users/notes']['req']
		>('users/notes', {
			...query,
			withFiles: !!query.onlyMedia ? query.onlyMedia : undefined,
		});

		return {
			data,
			maxId: data.length > 0 ? data[data.length - 1].id : null,
			minId: data.length > 0 ? data[0].id : null,
		};
	}

	async relationships(ids: string[]): Promise<MastoRelationship[]> {
		throw new Error('method not implemented');
	}

	async get(id: string): Promise<MissUserDetailed> {
		return this.client.client.request<any, Endpoints['users/show']['req']>(
			'users/show',
			{
				userId: id,
			},
		);
	}

	async resolveMany(ids: string[]): Promise<MissUserDetailed[]> {
		return this.client.client.request('users/show', {
			userIds: ids,
		});
	}

	/**
	 *
	 * @param id
	 * @param opts
	 *
	 * code: "BLOCKING"
	 */
	async follow(
		id: string,
		opts: FollowPostDto,
	): Promise<Endpoints['following/create']['res']> {
		try {
			return this.client.client.request('following/create', {
				userId: id,
				...opts,
			});
		} catch (e: any) {
			throw new Error(e.code ?? e);
		}
	}

	async unfollow(id: string): Promise<Endpoints['following/delete']['res']> {
		try {
			return this.client.client.request('following/delete', {
				userId: id,
			});
		} catch (e: any) {
			throw new Error(e.code ?? e);
		}
	}

	async block(id: string): Promise<Endpoints['blocking/create']['res']> {
		try {
			return this.client.client.request('blocking/create', {
				userId: id,
			});
		} catch (e: any) {
			throw new Error(e.code ?? e);
		}
	}

	async unblock(id: string): Promise<Endpoints['blocking/delete']['res']> {
		try {
			return await this.client.client.request('blocking/delete', {
				userId: id,
			});
		} catch (e: any) {
			throw new Error(e.code ?? e);
		}
	}

	/**
	 * Webfinger user search
	 * @param username
	 * @param host
	 */
	async findByWebfinger({
		username,
		host,
	}: {
		username: string;
		host: string | null;
	}) {
		try {
			const data = await this.client.client.request<
				any,
				Endpoints['users/show']['req']
			>('users/show', {
				username,
				host,
			});
			return { data };
		} catch (e: any) {
			throw new Error(e.code ?? e);
		}
	}

	async findByUserId(id: string) {
		try {
			const data = await this.client.client.request<
				any,
				Endpoints['users/show']['req']
			>('users/show', {
				userId: id,
			});
			return { data };
		} catch (e: any) {
			throw new Error(e.code ?? e);
		}
	}

	async findByUserIds(ids: string[]) {
		if (ids.length === 0) return { data: [] };
		try {
			const data = await this.client.client.request<
				any,
				Endpoints['users/show']['req']
			>('users/show', {
				userIds: ids,
			});
			return { data };
		} catch (e: any) {
			throw new Error(e.code ?? e);
		}
	}

	async renoteMute(id: string): Promise<{ renoteMuted: true }> {
		await this.client.client.request('renote-mute/create', {
			userId: id,
		});
		return { renoteMuted: true };
	}

	async renoteUnmute(id: string): Promise<{ renoteMuted: false }> {
		await this.client.client.request('renote-mute/delete', {
			userId: id,
		});
		return { renoteMuted: false };
	}

	async likes(query: GetPostsQueryDTO): Promise<any> {
		return errorBuilder(ApiErrorCode.FEATURE_UNSUPPORTED);
	}

	/**
	 * /i/apps seems bugged when
	 * using misskey-js
	 * @param query
	 */
	async bookmarks(
		query: BookmarkGetQueryDTO,
	): PaginatedPromise<Endpoints['i/favorites']['res']> {
		try {
			const data = await this.direct.post<Endpoints['i/favorites']['res']>(
				'/api/i/favorites',
				{
					limit: query.limit,
					untilId: !!query.maxId ? query.maxId : undefined,
				},
				{},
			);

			let maxId = null;
			let minId = null;

			if (data.length > 0) {
				maxId = data[data.length - 1].id;
				minId = data[0].id;
			}
			return {
				data: data.map((o) => o.note) as any[],
				maxId,
				minId,
			};
		} catch (e: any) {
			throw new Error(e.code ?? e);
		}
	}

	async getFollowers(
		query: FollowerGetQueryDTO,
	): PaginatedPromise<MissUserDetailed[]> {
		const data = await this.client.client.request('users/followers', {
			allowPartial: true,
			limit: query.limit,
			userId: query.id,
			untilId: !!query.maxId ? query.maxId : undefined,
		});
		return {
			data: data.map((o) => o.follower) as unknown as MissUserDetailed[] as any,
			maxId: data.length > 0 ? data[data.length - 1].followerId : null,
		};
	}

	async getFollowings(
		query: FollowerGetQueryDTO,
	): PaginatedPromise<MissUserDetailed[]> {
		const data = await this.client.client.request('users/following', {
			allowPartial: true,
			limit: query.limit,
			userId: query.id,
			untilId: !!query.maxId ? query.maxId : undefined,
		});
		return {
			data: data.map((o) => o.followee) as unknown as MissUserDetailed[] as any,
			maxId: data.length > 0 ? data[data.length - 1].followerId : null,
		};
	}

	async mute() {}
	async unmute() {}

	async removeFollower() {}

	async lookup() {}

	async featuredTags(id: string): Promise<MastoFeaturedTag[]> {
		throw new Error('method unsupported by driver');
	}

	async knownFollowers(ids: string[]): Promise<MastoFamiliarFollowers[]> {
		throw new Error('method unsupported by driver');
	}

	async getLists(): PaginatedPromise<Endpoints['users/lists/list']['res']> {
		try {
			const data = await this.client.client.request('users/lists/list', {});
			return {
				data,
				maxId: data.length > 0 ? data[data.length - 1].id : null,
			};
		} catch (e: any) {
			throw new Error(e.code ?? e);
		}
	}
}
