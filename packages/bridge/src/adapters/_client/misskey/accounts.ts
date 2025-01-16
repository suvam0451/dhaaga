import {
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from '../_router/routes/accounts.js';
import { Endpoints } from 'misskey-js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
	successWithData,
} from '../_router/dto/api-responses.dto.js';
import { BaseAccountsRouter } from '../default/accounts.js';
import { FollowPostDto, GetPostsQueryDTO } from '../_interface.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import type {
	MastoAccount,
	MastoRelationship,
} from '../../../types/mastojs.types.js';
import { MissUserDetailed } from '../../../types/misskey-js.types.js';
import {
	DhaagaErrorCode,
	LibraryResponse,
} from '../../../types/result.types.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MisskeyAccountsRouter
	extends BaseAccountsRouter
	implements AccountRoute
{
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		super();
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async statuses(id: string, query: AccountRouteStatusQueryDto) {
		const data = await this.client.client.request<
			'users/notes',
			Endpoints['users/notes']['req']
		>('users/notes', {
			...query,
			withFiles: !!query.onlyMedia ? query.onlyMedia : undefined,
		});
		return successWithData(data);
	}

	async relationships(ids: string[]): LibraryPromise<MastoRelationship[]> {
		return notImplementedErrorBuilder();
	}

	async get(id: string): LibraryPromise<MissUserDetailed> {
		const data = await this.client.client.request('users/show', { userId: id });
		return { data };
	}

	async getMany(ids: string[]): LibraryPromise<MissUserDetailed[]> {
		try {
			const data = await this.client.client.request('users/show', {
				userIds: ids,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e.code);
			}
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
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
	): LibraryPromise<Endpoints['following/create']['res']> {
		try {
			const data = await this.client.client.request('following/create', {
				userId: id,
				...opts,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e.code);
			}
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async unfollow(
		id: string,
	): LibraryPromise<Endpoints['following/delete']['res']> {
		try {
			const data = await this.client.client.request('following/delete', {
				userId: id,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e.code);
			}
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async block(id: string): LibraryPromise<Endpoints['blocking/create']['res']> {
		try {
			const data = await this.client.client.request('blocking/create', {
				userId: id,
			});
			return { data };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async unblock(
		id: string,
	): LibraryPromise<Endpoints['blocking/delete']['res']> {
		try {
			const data = await this.client.client.request('blocking/delete', {
				userId: id,
			});
			return { data };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async renoteMute(id: string): LibraryPromise<{ renoteMuted: true }> {
		try {
			await this.client.client.request('renote-mute/create', {
				userId: id,
			});
			return { data: { renoteMuted: true } };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async renoteUnmute(id: string): LibraryPromise<{ renoteMuted: false }> {
		try {
			await this.client.client.request('renote-mute/delete', {
				userId: id,
			});
			return { data: { renoteMuted: false } };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async likes(query: GetPostsQueryDTO): Promise<any> {
		return errorBuilder(DhaagaErrorCode.FEATURE_UNSUPPORTED);
	}

	/**
	 * /i/apps seems bugged when
	 * using misskey-js
	 * @param query
	 */
	async bookmarks(query: BookmarkGetQueryDTO): Promise<
		LibraryResponse<{
			data: Endpoints['i/favorites']['res'];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		try {
			const { data, error } = await this.direct.post<
				Endpoints['i/favorites']['res']
			>(
				'/api/i/favorites',
				{
					limit: query.limit,
					untilId: !!query.maxId ? query.maxId : undefined,
				},
				{},
			);
			if (error) {
				return {
					data: {
						data: [],
					},
				};
			}

			let maxId = null;
			let minId = null;

			if (data.length > 0) {
				maxId = data[data.length - 1].id;
				minId = data[0].id;
			}
			return {
				data: {
					data: data.map((o) => o.note) as any[],
					maxId,
					minId,
				},
			};
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
			}
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async followers(query: FollowerGetQueryDTO): LibraryPromise<
		| {
				data: MastoAccount[];
				minId?: string | null;
				maxId?: string | null;
		  }
		| {
				data: Endpoints['users/followers']['res'];
				minId?: string | null;
				maxId?: string | null;
		  }
	> {
		try {
			const data = await this.client.client.request('users/followers', {
				allowPartial: true,
				limit: query.limit,
				userId: query.id,
				untilId: !!query.maxId ? query.maxId : undefined,
			});
			return { data: { data } };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e.code);
			}
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async followings(query: FollowerGetQueryDTO): LibraryPromise<{
		data: Endpoints['users/following']['res'];
		minId?: string | null;
		maxId?: string | null;
	}> {
		try {
			const data = await this.client.client.request('users/following', {
				allowPartial: true,
				limit: query.limit,
				userId: query.id,
				untilId: !!query.maxId ? query.maxId : undefined,
			});
			return { data: { data } };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e.code);
			}
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
