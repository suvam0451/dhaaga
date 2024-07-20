import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';

/**
 * Wrapper service to invoke provider functions
 */
class ActivityPubProviderService {
	static async getStatusContext(client: ActivityPubClient, id: string) {
		return client.getStatusContext(id);
	}

	static async getStatus(client: ActivityPubClient, id: string) {
		return client.getStatus(id);
	}

	static async getStatusAsArray(client: ActivityPubClient, id: string) {
		const status = await client.getStatus(id);
		return [status];
	}
}

export default ActivityPubProviderService;
