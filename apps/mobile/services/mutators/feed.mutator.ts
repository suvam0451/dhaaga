import { KNOWN_SOFTWARE, ActivityPubClient } from '@dhaaga/bridge';
import type { FeedObjectType } from '@dhaaga/core';

export class FeedMutator {
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ActivityPubClient;

	constructor(driver: KNOWN_SOFTWARE, client: ActivityPubClient) {
		this.driver = driver;
		this.client = client;
	}

	async toggleLike(input: FeedObjectType): Promise<FeedObjectType> {
		if (this.driver !== KNOWN_SOFTWARE.BLUESKY) return input;
	}

	async addSubscription(input: FeedObjectType): Promise<FeedObjectType> {
		if (this.driver !== KNOWN_SOFTWARE.BLUESKY) return input;
	}

	async removeSubscription(input: FeedObjectType): Promise<FeedObjectType> {
		if (this.driver !== KNOWN_SOFTWARE.BLUESKY) return input;
	}
}
