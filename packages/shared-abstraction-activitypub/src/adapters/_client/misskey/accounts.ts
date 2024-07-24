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
	notImplementedErrorBuilder,
	successWithData,
} from '../_router/dto/api-responses.dto.js';
import { BaseAccountsRouter } from '../default/accounts.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoAccount, MastoRelationship } from '../_interface.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { UserDetailed } from 'misskey-js/autogen/models.js';

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

	async relationships(
		ids: string[],
	): Promise<LibraryResponse<MastoRelationship[]>> {
		return notImplementedErrorBuilder();
	}

	async get(id: string): LibraryPromise<MastoAccount | UserDetailed> {
		const data = await this.lib.client.request('users/show', { userId: id });
		return { data };
	}
}
