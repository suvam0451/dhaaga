import {
	AccountRoute,
	AccountRouteStatusQueryDto
} from '../_router/routes/accounts.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/instance.js';
import {
	notImplementedErrorBuilder,
	successWithData
} from '../_router/dto/api-responses.dto.js';
import { BaseAccountsRouter } from '../default/accounts.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoRelationship } from '../_interface.js';

export class PleromaAccountsRouter
	extends BaseAccountsRouter
	implements AccountRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MEGALODON>;

	constructor(forwarded: RestClient) {
		super();
		this.client = forwarded;
		this.lib = DhaagaMegalodonClient(
			KNOWN_SOFTWARE.PLEROMA,
			this.client.url,
			this.client.accessToken
		);
	}

	async statuses(id: string, query: AccountRouteStatusQueryDto) {
		// this.lib.client.
		return successWithData([]);
	}

	async relationships(ids: string[]): Promise<LibraryResponse<MastoRelationship[]>> {
		return notImplementedErrorBuilder();
	}
}
