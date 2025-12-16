import type { FeedObjectType } from '#/types/index.js';
import { KNOWN_SOFTWARE } from '#/client/utils/driver.js';
import { ApiTargetInterface, AtprotoApiAdapter } from '#/client/index.js';
import { AppBskyActorGetPreferences } from '@atproto/api';

class Mutator {
	/**
	 * Not implemented
	 * @param client
	 * @param input
	 * @param prefs
	 */
	static async toggleLike(
		client: ApiTargetInterface,
		input: FeedObjectType,
		prefs?: AppBskyActorGetPreferences.OutputSchema,
	): Promise<FeedObjectType> {
		if (client.driver !== KNOWN_SOFTWARE.BLUESKY) {
			console.log(
				'[WARN]: tried to perform feed object mutations with a non-compatible driver',
			);
			return input;
		}

		const _client = client as unknown as AtprotoApiAdapter;

		try {
			if (!input.saved) return input;
			if (input.viewer.like) {
				await _client.feeds.removeLike(input.uri);
			} else {
				await _client.feeds.like(input.uri);
			}
			return input;
		} catch (e) {
			return input;
		}
	}

	static async toggleSubscription(
		client: ApiTargetInterface,
		input: FeedObjectType,
		prefs?: AppBskyActorGetPreferences.OutputSchema,
	): Promise<FeedObjectType> {
		if (client.driver !== KNOWN_SOFTWARE.BLUESKY) {
			console.log(
				'[WARN]: tried to perform feed object mutations with a non-compatible driver',
			);
			return input;
		}

		const _client = client as unknown as AtprotoApiAdapter;

		try {
			if (input.saved) {
				await _client.feeds.removeSubscription(input.uri, prefs);
			} else {
				await _client.feeds.addSubscription(input.uri, prefs);
			}
			return {
				...input,
				saved: !input.saved,
				pinned: !input.saved,
			};
		} catch (e) {
			return input;
		}
	}
}

export { Mutator as FeedMutator };
