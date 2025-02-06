import { AccountRoute } from '../_router/routes/_index.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
	successWithData,
} from '../_router/dto/api-responses.dto.js';
import { MastoErrorHandler, MastojsHandler } from '../_router/_runner.js';
import {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from '../_router/routes/accounts.js';
import { FollowPostDto, GetPostsQueryDTO } from '../_interface.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import {
	LibraryPromise,
	PaginatedLibraryPromise,
} from '../_router/routes/_types.js';
import {
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MastoStatus,
} from '../../../types/mastojs.types.js';
import {
	DhaagaErrorCode,
	LibraryResponse,
} from '../../../types/result.types.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MastodonAccountsRouter implements AccountRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async lookup(webfingerUrl: string): Promise<LibraryResponse<MastoAccount>> {
		try {
			const data = await this.client.lib.v1.accounts.lookup({
				acct: webfingerUrl,
			});
			return { data };
		} catch (e) {
			return errorBuilder('Record not found');
		}
	}

	async follow(
		id: string,
		opts: FollowPostDto,
	): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.client.lib.v1.accounts.$select(id).follow;
		return await MastojsHandler(await MastoErrorHandler(fn, [opts]));
	}

	async unfollow(id: string): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.client.lib.v1.accounts.$select(id).unfollow;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async block(id: string): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.client.lib.v1.accounts.$select(id).block;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async unblock(id: string): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.client.lib.v1.accounts.$select(id).unblock;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.client.lib.v1.accounts.$select(id).mute;
		return await MastojsHandler(await MastoErrorHandler(fn, [opts]));
	}

	async unmute(id: string): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.client.lib.v1.accounts.$select(id).unmute;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async removeFollower(id: string): Promise<LibraryResponse<void>> {
		const fn = this.client.lib.v1.accounts.$select(id).removeFromFollowers;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async featuredTags(id: string): Promise<LibraryResponse<MastoFeaturedTag[]>> {
		try {
			const fn = await this.client.lib.v1.accounts
				.$select(id)
				.featuredTags.list();
			return successWithData(fn);
		} catch (e) {
			return errorBuilder<MastoFeaturedTag[]>(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async familiarFollowers(
		ids: string[],
	): Promise<LibraryResponse<MastoFamiliarFollowers[]>> {
		const fn = this.client.lib.v1.accounts.familiarFollowers.fetch;
		return await MastojsHandler(await MastoErrorHandler(fn, [ids]));
	}

	lists(id: string): Promise<LibraryResponse<MastoList[]>> {
		throw new Error('Method not implemented.');
	}

	async statuses(
		id: string,
		query: AccountRouteStatusQueryDto,
	): Promise<LibraryResponse<MastoStatus[]>> {
		try {
			const data = await this.client.lib.v1.accounts
				.$select(id)
				.statuses.list(query);
			return { data };
		} catch (e) {
			return errorBuilder<MastoStatus[]>(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async get(id: string): Promise<LibraryResponse<MastoAccount>> {
		const fn = this.client.lib.v1.accounts.$select(id).fetch;
		const { data, error } = await MastoErrorHandler(fn);
		const resData = await data;
		if (error || resData === undefined) {
			return errorBuilder(error);
		}
		return successWithData(data);
	}

	async getMany(ids: string[]): LibraryPromise<MastoAccount[]> {
		return await new FetchWrapper(
			this.direct.baseUrl,
			this.direct.token,
		).getCamelCase('/api/v1/accounts', { id: ids });
	}

	async relationships(
		ids: string[],
	): Promise<LibraryResponse<MastoRelationship[]>> {
		const fn = this.client.lib.v1.accounts.relationships.fetch;
		const { data, error } = await MastoErrorHandler(fn, [{ id: ids }]);
		const resData = await data;
		if (error || resData === undefined) {
			return errorBuilder(error);
		}
		return successWithData(data);
	}

	async likes(query: GetPostsQueryDTO): PaginatedLibraryPromise<MastoStatus[]> {
		const { data: _data, error } =
			await this.direct.getCamelCaseWithLinkPagination<MastoStatus[]>(
				'/api/v1/favourites',
				query,
			);

		if (!_data || error) {
			return notImplementedErrorBuilder<{
				data: MastoStatus[];
				minId: string | null;
				maxId: string | null;
			}>();
		}
		return {
			data: _data,
		};
	}

	async bookmarks(query: BookmarkGetQueryDTO): Promise<
		LibraryResponse<{
			data: MastoStatus[];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		const { data: _data, error } =
			await this.direct.getCamelCaseWithLinkPagination<MastoStatus[]>(
				'/api/v1/bookmarks',
				query,
			);

		if (!_data || error) {
			return notImplementedErrorBuilder<{
				data: MastoStatus[];
				minId: string | null;
				maxId: string | null;
			}>();
		}
		return {
			data: _data,
		};
	}

	async followers(query: FollowerGetQueryDTO): LibraryPromise<{
		data: MastoAccount[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		try {
			const { id, ...rest } = query;
			const { data: _data, error } =
				await this.direct.getCamelCaseWithLinkPagination<MastoAccount[]>(
					`/api/v1/accounts/${id}/followers`,
					rest,
				);

			if (error) {
				return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
			}
			return { data: _data };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async followings(query: FollowerGetQueryDTO): LibraryPromise<{
		data: MastoAccount[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		try {
			const { id, ...rest } = query;
			const { data: _data, error } =
				await this.direct.getCamelCaseWithLinkPagination<MastoAccount[]>(
					`/api/v1/accounts/${id}/following`,
					rest,
				);

			if (error) {
				return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
			}
			return { data: _data };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
