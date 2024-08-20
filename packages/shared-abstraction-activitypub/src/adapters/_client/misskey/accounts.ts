import {
	AccountRoute,
	AccountRouteStatusQueryDto,
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
	MastoRelationship,
	MissUserDetailed,
} from '../_interface.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { DhaagaErrorCode } from '../_router/_types.js';

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
}
