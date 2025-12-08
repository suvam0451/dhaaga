import {
	type ApiTargetInterface,
	MastoApiAdapter,
	MisskeyApiAdapter,
	PleromaApiAdapter,
} from '../client/index.js';
import { DriverService } from './driver.js';

enum KNOWN_SOFTWARE {
	// Fediverse Parent Software
	AKKOMA = 'akkoma', // Bluesky
	BLUESKY = 'bluesky',
	CHERRYPICK = 'cherrypick',
	FIREFISH = 'firefish',
	FRIENDICA = 'friendica',
	GOTOSOCIAL = 'gotosocial',
	HOMETOWN = 'hometown',
	ICESHRIMP = 'iceshrimp', // smol fork
	KMYBLUE = 'kmyblue',
	LEMMY = 'lemmy',

	MASTODON = 'mastodon',
	MEISSKEY = 'meisskey',
	MISSKEY = 'misskey',

	PEERTUBE = 'peertube',
	PIXELFED = 'pixelfed',
	PLEROMA = 'pleroma',
	SHARKEY = 'sharkey',

	// software could not be detected
	UNKNOWN = 'unknown',
}

/**
 * Provides a set of static utility methods for interacting with ActivityPub-compatible
 * software and APIs, such as Mastodon, Misskey, Pleroma, etc. This service centralizes
 * the logic for checking feature support, toggling state (e.g., bookmarks, likes, boosts),
 * detecting software, and constructing sign-in URLs for ActivityPub instances.
 */
class ActivityPubService {
	/**
	 * Does this driver implement
	 * bookmarks?
	 * @param driver
	 */
	static canBookmark(driver: KNOWN_SOFTWARE | string) {
		return DriverService.canBookmark(driver);
	}

	/**
	 * Does this driver implement
	 * likes?
	 * @param driver
	 */
	static canLike(driver: KNOWN_SOFTWARE | string) {
		return DriverService.canLike(driver);
	}

	static canAddReactions(driver: string) {
		DriverService.canReact(driver);
	}

	/**
	 * Check MastoAPI compatibility
	 * @param driver
	 */
	static mastodonLike(driver: string) {
		return [
			KNOWN_SOFTWARE.MASTODON,
			KNOWN_SOFTWARE.PLEROMA,
			KNOWN_SOFTWARE.AKKOMA,
		].includes(driver as KNOWN_SOFTWARE);
	}

	static supportsV2(driver: string) {
		return DriverService.supportsMastoApiV2(driver);
	}

	static supportsQuotesNatively(driver: string) {
		return DriverService.canQuote(driver);
	}

	static pleromaLike(driver: string) {
		return [KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(
			driver as KNOWN_SOFTWARE,
		);
	}

	static misskeyLike(driver: string) {
		return DriverService.supportsMisskeyApi(driver);
	}

	static blueskyLike(driver: KNOWN_SOFTWARE | string) {
		return DriverService.supportsAtProto(driver);
	}

	/**
	 * toggle the bookmark status and return the next state
	 * @param client
	 * @param id
	 * @param localState
	 */
	static async toggleBookmark(
		client: ApiTargetInterface,
		id: string,
		localState: boolean,
	) {
		return localState ? client.posts.unBookmark(id) : client.posts.bookmark(id);
	}

	static async toggleLike(
		client: ApiTargetInterface,
		localState: boolean | undefined,
		idA: string,
		idB?: string,
	) {
		if (localState) return client.posts.removeLike(idA, idB);
		return client.posts.like(idA, idB);
	}

	static async toggleBoost(
		client: ApiTargetInterface,
		id: string,
		localState: boolean,
		domain: KNOWN_SOFTWARE,
	): Promise<-1 | 1 | null> {
		if (ActivityPubService.misskeyLike(domain)) {
			if (localState) {
				const { error } = await (client as MisskeyApiAdapter).posts.unrenote(
					id,
				);
				if (error) {
					console.log('[WARN]: failed to remove boost', error);
					return null;
				}
				return -1;
			} else {
				const { error } = await (client as MisskeyApiAdapter).posts.renote({
					renoteId: id,
					visibility: 'followers',
					localOnly: true,
				});
				if (error) {
					console.log('[WARN]: failed to boost', error);
					return null;
				}
				return +1;
			}
		} else if (domain === KNOWN_SOFTWARE.MASTODON) {
			if (localState) {
				await (client as MastoApiAdapter).posts.removeBoost(id);
				return -1;
			} else {
				await (client as MastoApiAdapter).posts.boost(id);
				return 1;
			}
		} else {
			if (localState) {
				const { error } = await (client as PleromaApiAdapter).posts.removeBoost(
					id,
				);
				if (error) {
					console.log('[WARN]: failed to remove boost', error);
					return null;
				}
				return -1;
			} else {
				const { error } = await (client as PleromaApiAdapter).posts.boost(id);
				if (error) {
					console.log('[WARN]: failed to boost', error);
					return null;
				}
				return 1;
			}
		}
	}

	/**
	 * For misskey specifically, finalizes and binds the current
	 * bookmark status for a post-object
	 *
	 * This function would fail for drivers other than misskey
	 * @param client
	 * @param id
	 */
	static async getBookmarkState(
		client: ApiTargetInterface,
		id: string,
	): Promise<boolean | null> {
		const { data, error } = await (client as MisskeyApiAdapter).posts.getState(
			id,
		);
		if (error) {
			console.log('[WARN]: error fetching bookmarked state');
			return null;
		}
		return data.isFavorited;
	}
}

export default ActivityPubService;
