import { KNOWN_SOFTWARE, ApiTargetInterface } from '@dhaaga/bridge';
import type { FeedObjectType } from '@dhaaga/bridge';

export class FeedMutator {
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ApiTargetInterface;

	constructor(driver: KNOWN_SOFTWARE, client: ApiTargetInterface) {
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
