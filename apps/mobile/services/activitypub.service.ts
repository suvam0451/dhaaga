import {
	ActivityPubClient,
	MastodonRestClient,
	MisskeyRestClient,
	UnknownRestClient,
	PleromaRestClient,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import { SQLiteDatabase } from 'expo-sqlite';
import { RandomUtil } from '../utils/random.utils';
import AppSessionManager from './session/app-session.service';
import { KnownServer, Profile } from '../database/_schema';

class ActivityPubService {
	/**
	 * Does this driver implement
	 * bookmarks?
	 * @param driver
	 */
	static canBookmark(driver: KNOWN_SOFTWARE | string) {
		return (
			ActivityPubService.mastodonLike(driver) ||
			ActivityPubService.misskeyLike(driver)
		);
	}

	/**
	 * Does this driver implement
	 * likes?
	 * @param driver
	 */
	static canLike(driver: KNOWN_SOFTWARE | string) {
		return (
			ActivityPubService.mastodonLike(driver) ||
			ActivityPubService.blueskyLike(driver)
		);
	}

	static canAddReactions(driver: string) {
		return (
			ActivityPubService.misskeyLike(driver) ||
			ActivityPubService.pleromaLike(driver)
		);
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
		return [KNOWN_SOFTWARE.MASTODON].includes(driver as KNOWN_SOFTWARE);
	}

	static pleromaLike(driver: string) {
		return [KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(
			driver as KNOWN_SOFTWARE,
		);
	}

	static misskeyLike(driver: string) {
		return [
			KNOWN_SOFTWARE.MISSKEY,
			KNOWN_SOFTWARE.SHARKEY,
			KNOWN_SOFTWARE.FIREFISH,
			KNOWN_SOFTWARE.ICESHRIMP,
			KNOWN_SOFTWARE.CHERRYPICK,
		].includes(driver as KNOWN_SOFTWARE);
	}

	static blueskyLike(driver: KNOWN_SOFTWARE | string) {
		return [KNOWN_SOFTWARE.BLUESKY].includes(driver as KNOWN_SOFTWARE);
	}

	/**
	 * Syncs the nodeinfo and software
	 * for a subdomain
	 * @param db
	 * @param urlLike
	 */
	static async syncSoftware(
		db: SQLiteDatabase,
		urlLike: string,
	): Promise<KnownServer> {
		return null;
	}

	/**
	 * toggle the bookmark status and return next state
	 * @param client
	 * @param id
	 * @param localState
	 */
	static async toggleBookmark(
		client: ActivityPubClient,
		id: string,
		localState: boolean,
	): Promise<boolean> {
		try {
			if (localState) {
				const { error } = await client.statuses.unBookmark(id);
				if (error?.code === 'NOT_FAVOURITED') return false;
				if (error) {
					if (error.code === 'NOT_FAVORITED') {
						return false;
					}
					console.log('[WARN]: could not remove bookmark', error);
					return localState;
				}
				return false;
			} else {
				const { error } = await client.statuses.bookmark(id);
				if (error?.code === 'ALREADY_FAVOURITED') return true;
				if (error) {
					if (error.code === 'ALREADY_FAVORITED') {
						return true;
					}
					console.log('[WARN]: could not add bookmark', error);
					return localState;
				}
				return true;
			}
		} catch (e) {
			// incorrect local state
			if (e.code === 'ERR_BAD_REQUEST' || e.code === 'ERR_BAD_RESPONSE') {
				return !localState;
			}
			console.log(e.code);
			return localState;
		}
	}

	static async toggleLike(
		client: ActivityPubClient,
		id: string,
		localState: boolean,
		domain: KNOWN_SOFTWARE,
	) {
		if (ActivityPubService.misskeyLike(domain)) return null;

		if (localState) {
			const { error } = await client.statuses.removeLike(id);
			if (error) {
				console.log('[WARN]: failed to like status', error);
				return null;
			}
			return -1;
		} else {
			const { error } = await client.statuses.like(id);
			if (error) {
				console.log('[WARN]: failed to remove like for status', error);
				return null;
			}
			return +1;
		}
	}

	static async toggleBoost(
		client: ActivityPubClient,
		id: string,
		localState: boolean,
		domain: KNOWN_SOFTWARE,
	) {
		if (ActivityPubService.misskeyLike(domain)) {
			if (localState) {
				const { error } = await (client as MisskeyRestClient).statuses.unrenote(
					id,
				);
				if (error) {
					console.log('[WARN]: failed to remove boost', error);
					return null;
				}
				return -1;
			} else {
				const { error } = await (client as MisskeyRestClient).statuses.renote({
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
				const { error } = await (
					client as MastodonRestClient
				).statuses.removeBoost(id);
				if (error) {
					console.log('[WARN]: failed to remove boost', error);
					return null;
				}
				return -1;
			} else {
				const { error } = await (client as MastodonRestClient).statuses.boost(
					id,
				);
				if (error) {
					console.log('[WARN]: failed to boost', error);
					return null;
				}
				return 1;
			}
		} else {
			if (localState) {
				const { error } = await (
					client as PleromaRestClient
				).statuses.removeBoost(id);
				if (error) {
					console.log('[WARN]: failed to remove boost', error);
					return null;
				}
				return -1;
			} else {
				const { error } = await (client as PleromaRestClient).statuses.boost(
					id,
				);
				if (error) {
					console.log('[WARN]: failed to boost', error);
					return null;
				}
				return 1;
			}
		}
	}

	/**
	 * detect software for a subdomain
	 * @param urlLike
	 */
	static async detectSoftware(urlLike: string) {
		const client = new UnknownRestClient();
		const { data, error } = await client.instances.getSoftwareInfo(urlLike);
		if (error || !data) return null;
		return data.software;
	}

	/**
	 * Evaluates instance software/version and
	 * generates the sign-in url to be used
	 * in the webview
	 *
	 * Supported strategies are:
	 *
	 * - code
	 * - miauth
	 * @param urlLike
	 * @param mngr
	 */
	static async signInUrl(urlLike: string, mngr: AppSessionManager) {
		console.log(urlLike);
		const tokens = mngr.storage.getAtprotoServerClientTokens(urlLike);

		const client = new UnknownRestClient();
		const { data, error } = await client.instances.getLoginUrl(urlLike, {
			appCallback: 'https://suvam.io',
			appName: 'Dhaaga',
			appClientId: tokens?.clientId,
			appClientSecret: tokens?.clientSecret,
			uuid: RandomUtil.nanoId(),
		});
		if (error) return null;
		return data;
	}

	/**
	 * For misskey specifically, finalises and binds the current
	 * bookmark status for a post object
	 *
	 * This function would fail for drivers other than misskey
	 * @param client
	 * @param id
	 */
	static async getBookmarkState(
		client: ActivityPubClient,
		id: string,
	): Promise<boolean> {
		const { data, error } = await (
			client as MisskeyRestClient
		).statuses.getState(id);
		if (error) {
			console.log('[WARN]: error fetching bookmarked state');
			return null;
		}
		return data.isFavorited;
	}

	/**
	 * Pin the default timelines and hashtags for
	 * the profile
	 * @param manager the app level session manager, with db connection
	 * @param profile
	 */
	static createDefaultPins(manager: AppSessionManager, profile: Profile) {}
}

export default ActivityPubService;
