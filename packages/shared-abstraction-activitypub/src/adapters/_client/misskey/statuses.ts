import { LibraryResponse } from '../_router/_types.js';
import { StatusesRoute } from '../_router/routes/statuses.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { MastoStatus } from '../_interface.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';

export class MisskeyStatusesRouter implements StatusesRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}
	
	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		return notImplementedErrorBuilder();
	}
}
