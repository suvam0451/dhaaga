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

export class MastodonAccountsRouter implements AccountRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
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
}
