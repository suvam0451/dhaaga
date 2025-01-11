import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import ActivityPubClient from '@dhaaga/bridge/dist/adapters/_client/_interface';
import { AppFeedObject } from '../../types/app-feed.types';

export class FeedMutator {
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ActivityPubClient;

	constructor(driver: KNOWN_SOFTWARE, client: ActivityPubClient) {
		this.driver = driver;
		this.client = client;
	}

	async toggleLike(input: AppFeedObject): Promise<AppFeedObject> {
		if (this.driver !== KNOWN_SOFTWARE.BLUESKY) return input;
	}

	async addSubscription(input: AppFeedObject): Promise<AppFeedObject> {
		if (this.driver !== KNOWN_SOFTWARE.BLUESKY) return input;
	}

	async removeSubscription(input: AppFeedObject): Promise<AppFeedObject> {
		if (this.driver !== KNOWN_SOFTWARE.BLUESKY) return input;
	}
}
