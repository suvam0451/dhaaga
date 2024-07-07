import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { StatusesRoute } from '../_router/routes/statuses.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoStatus } from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';

export class PleromaStatusesRouter implements StatusesRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		return notImplementedErrorBuilder();
	}
}
