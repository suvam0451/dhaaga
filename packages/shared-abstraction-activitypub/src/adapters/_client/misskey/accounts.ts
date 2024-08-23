import {
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
} from '../_router/routes/accounts.js';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { Endpoints } from 'misskey-js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
	successWithData,
} from '../_router/dto/api-responses.dto.js';
import { BaseAccountsRouter } from '../default/accounts.js';
import {
	FollowPostDto,
	GetPostsQueryDTO,
	MastoRelationship,
	MastoStatus,
	MissUserDetailed,
} from '../_interface.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import AppApi from '../../_api/AppApi.js';

export class MisskeyAccountsRouter
	extends BaseAccountsRouter
	implements AccountRoute
{
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		super();
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	async statuses(id: string, query: AccountRouteStatusQueryDto) {
		const data = await this.lib.client.request<
			'users/notes',
			Endpoints['users/notes']['req']
		>('users/notes', query);
		return successWithData(data);
	}

	async relationships(ids: string[]): LibraryPromise<MastoRelationship[]> {
		return notImplementedErrorBuilder();
	}

	async get(id: string): LibraryPromise<MissUserDetailed> {
		const data = await this.lib.client.request('users/show', { userId: id });
		return { data };
	}

	async getMany(ids: string[]): LibraryPromise<MissUserDetailed[]> {
		try {
			const data = await this.lib.client.request('users/show', {
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
			const data = await this.lib.client.request('following/create', {
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
			const data = await this.lib.client.request('following/delete', {
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
			const data = await this.lib.client.request('blocking/create', {
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
			const data = await this.lib.client.request('blocking/delete', {
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
			await this.lib.client.request('renote-mute/create', {
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
			await this.lib.client.request('renote-mute/delete', {
				userId: id,
			});
			return { data: { renoteMuted: false } };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async likes(opts: GetPostsQueryDTO): LibraryPromise<MastoStatus[]> {
		return errorBuilder(DhaagaErrorCode.FEATURE_UNSUPPORTED);
	}

	/**
	 * /i/favourites seems bugged when
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
			const { data, error } = await new AppApi(
				this.client.url,
				this.client.accessToken,
			).post<Endpoints['i/favorites']['res']>(
				'/api/i/favorites',
				{
					...query,
					allowPartial: true,
					limit: query.limit,
					untilId: query.maxId,
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
					data,
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
}
