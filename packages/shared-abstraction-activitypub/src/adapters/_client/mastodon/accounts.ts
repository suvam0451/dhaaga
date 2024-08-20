import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { AccountRoute } from '../_router/routes/_index.js';
import {
	errorBuilder,
	successWithData,
} from '../_router/dto/api-responses.dto.js';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
	MastoErrorHandler,
	MastojsHandler,
} from '../_router/_runner.js';
import {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
} from '../_router/routes/accounts.js';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import {
	FollowPostDto,
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MastoStatus,
} from '../_interface.js';
import AppApi from '../../_api/AppApi.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class MastodonAccountsRouter implements AccountRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async lookup(webfingerUrl: string): Promise<LibraryResponse<MastoAccount>> {
		const fn = this.lib.client.v1.accounts.lookup;
		return await MastojsHandler(
			await MastoErrorHandler(fn, [{ acct: webfingerUrl }]),
		);
	}

	async follow(
		id: string,
		opts: FollowPostDto,
	): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.lib.client.v1.accounts.$select(id).follow;
		return await MastojsHandler(await MastoErrorHandler(fn, [opts]));
	}

	async unfollow(id: string): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.lib.client.v1.accounts.$select(id).unfollow;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async block(id: string): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.lib.client.v1.accounts.$select(id).block;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async unblock(id: string): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.lib.client.v1.accounts.$select(id).unblock;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.lib.client.v1.accounts.$select(id).mute;
		return await MastojsHandler(await MastoErrorHandler(fn, [opts]));
	}

	async unmute(id: string): Promise<LibraryResponse<MastoRelationship>> {
		const fn = this.lib.client.v1.accounts.$select(id).unmute;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async removeFollower(id: string): Promise<LibraryResponse<void>> {
		const fn = this.lib.client.v1.accounts.$select(id).removeFromFollowers;
		return await MastojsHandler(await MastoErrorHandler(fn));
	}

	async featuredTags(id: string): Promise<LibraryResponse<MastoFeaturedTag[]>> {
		try {
			const fn = await this.lib.client.v1.accounts
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
		const fn = this.lib.client.v1.accounts.familiarFollowers.fetch;
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
			const data = await this.lib.client.v1.accounts
				.$select(id)
				.statuses.list(query);
			return { data };
		} catch (e) {
			return errorBuilder<MastoStatus[]>(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async get(id: string): Promise<LibraryResponse<MastoAccount>> {
		const fn = this.lib.client.v1.accounts.$select(id).fetch;
		const { data, error } = await MastoErrorHandler(fn);
		const resData = await data;
		if (error || resData === undefined) {
			return errorBuilder(error);
		}
		return successWithData(data);
	}

	async getMany(ids: string[]): LibraryPromise<MastoAccount[]> {
		return await new AppApi(
			this.client.url,
			this.client.accessToken,
		).getCamelCase('/api/v1/accounts', { id: ids });
	}

	async relationships(
		ids: string[],
	): Promise<LibraryResponse<MastoRelationship[]>> {
		const fn = this.lib.client.v1.accounts.relationships.fetch;
		const { data, error } = await MastoErrorHandler(fn, [{ id: ids }]);
		const resData = await data;
		if (error || resData === undefined) {
			return errorBuilder(error);
		}
		return successWithData(data);
	}
}
