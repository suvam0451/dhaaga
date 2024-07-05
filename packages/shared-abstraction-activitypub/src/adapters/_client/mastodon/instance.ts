import { InstanceRoute } from '../_router/instance';
import { RestClient } from '@dhaaga/shared-provider-mastodon/src';
import { createRestAPIClient } from 'masto';

export class MastodonInstanceRouter implements InstanceRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	private createMastoClient() {
		return createRestAPIClient({
			url: `https://${this.client.url}`,
			accessToken: this.client.accessToken,
		});
	}

	async getTranslation(id: string, lang: string) {
		const _client = this.createMastoClient();
		const data = await _client.v1.statuses
			.$select(id)
			.translate({ lang: 'en' });
		return {
			data,
		};
	}
}
