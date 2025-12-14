import type { FeedObjectType } from '#/types/index.js';
import { KNOWN_SOFTWARE } from '#/client/utils/driver.js';
import { ApiTargetInterface } from '#/client/index.js';

class Mutator {
	static async toggleLike(
		client: ApiTargetInterface,
		input: FeedObjectType,
	): Promise<FeedObjectType> {
		if (client.driver !== KNOWN_SOFTWARE.BLUESKY) {
			console.log(
				'[WARN]: tried to perform feed object mutations with a non-compatible driver',
			);
			return input;
		}
		return input;
	}

	static async addSubscription(
		client: ApiTargetInterface,
		input: FeedObjectType,
	): Promise<FeedObjectType> {
		if (client.driver !== KNOWN_SOFTWARE.BLUESKY) {
			console.log(
				'[WARN]: tried to perform feed object mutations with a non-compatible driver',
			);
			return input;
		}
		return input;
	}

	static async removeSubscription(
		client: ApiTargetInterface,
		input: FeedObjectType,
	): Promise<FeedObjectType> {
		if (client.driver !== KNOWN_SOFTWARE.BLUESKY) {
			console.log(
				'[WARN]: tried to perform feed object mutations with a non-compatible driver',
			);
			return input;
		}
		return input;
	}
}

export { Mutator as FeedMutator };
