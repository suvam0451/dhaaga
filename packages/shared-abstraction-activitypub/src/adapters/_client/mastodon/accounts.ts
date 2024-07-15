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
} from '../_router/_runner.js';
import { AccountRouteStatusQueryDto } from '../_router/routes/accounts.js';
import { BaseAccountsRouter } from '../default/accounts.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoAccount, MastoStatus } from '../_interface.js';

export class MastodonAccountsRouter
	extends BaseAccountsRouter
	implements AccountRoute
{
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		super();
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async statuses(id: string, query: AccountRouteStatusQueryDto) {
		const fn = this.lib.client.v1.accounts.$select(id).statuses.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		const resData = await data;
		if (error || resData === undefined) {
			return errorBuilder(error);
		}
		return successWithData(data);
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
}
