import {
	ApiTargetInterface,
	MastoApiAdapter,
	MisskeyApiAdapter,
	BaseApiAdapter,
	PleromaApiAdapter,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import AppSessionManager from './session/app-session.service';
import { DriverService, RandomUtil } from '@dhaaga/bridge';

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
	 * toggle the bookmark status and return next state
	 * @param client
	 * @param id
	 * @param localState
	 */
	static async toggleBookmark(
		client: ApiTargetInterface,
		id: string,
		localState: boolean,
	) {
		return localState
			? client.statuses.unBookmark(id)
			: client.statuses.bookmark(id);
	}

	static async toggleLike(
		client: ApiTargetInterface,
		localState: boolean | undefined,
		idA: string,
		idB?: string,
	) {
		if (localState) return client.statuses.removeLike(idA, idB);
		return client.statuses.like(idA, idB);
	}

	static async toggleBoost(
		client: ApiTargetInterface,
		id: string,
		localState: boolean,
		domain: KNOWN_SOFTWARE,
	) {
		if (ActivityPubService.misskeyLike(domain)) {
			if (localState) {
				const { error } = await (client as MisskeyApiAdapter).statuses.unrenote(
					id,
				);
				if (error) {
					console.log('[WARN]: failed to remove boost', error);
					return null;
				}
				return -1;
			} else {
				const { error } = await (client as MisskeyApiAdapter).statuses.renote({
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
					client as MastoApiAdapter
				).statuses.removeBoost(id);
				if (error) {
					console.log('[WARN]: failed to remove boost', error);
					return null;
				}
				return -1;
			} else {
				const { error } = await (client as MastoApiAdapter).statuses.boost(id);
				if (error) {
					console.log('[WARN]: failed to boost', error);
					return null;
				}
				return 1;
			}
		} else {
			if (localState) {
				const { error } = await (
					client as PleromaApiAdapter
				).statuses.removeBoost(id);
				if (error) {
					console.log('[WARN]: failed to remove boost', error);
					return null;
				}
				return -1;
			} else {
				const { error } = await (client as PleromaApiAdapter).statuses.boost(
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
		const client = new BaseApiAdapter();
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

		const client = new BaseApiAdapter();
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
		client: ApiTargetInterface,
		id: string,
	): Promise<boolean> {
		const { data, error } = await (
			client as MisskeyApiAdapter
		).statuses.getState(id);
		if (error) {
			console.log('[WARN]: error fetching bookmarked state');
			return null;
		}
		return data.isFavorited;
	}
}

export default ActivityPubService;
