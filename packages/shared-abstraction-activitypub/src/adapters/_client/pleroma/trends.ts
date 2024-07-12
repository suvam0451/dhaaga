import { TrendsRoute } from '../_router/routes/trends.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';

export class PleromaTrendsRouter implements TrendsRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	async tags() {
		return notImplementedErrorBuilder();
	}

	async posts() {
		return notImplementedErrorBuilder();
	}

	async links() {
		return notImplementedErrorBuilder();
	}
}
