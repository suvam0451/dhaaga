import {
	ActivityPubClient,
	MisskeyRestClient,
	UnknownRestClient,
} from '@dhaaga/shared-abstraction-activitypub';
import * as Crypto from 'expo-crypto';
import { MMKV } from 'react-native-mmkv';
import MmkvService from './mmkv.service';
import { Realm } from 'realm';
import { ActivityPubServerRepository } from '../repositories/activitypub-server.repo';
import { ActivityPubServer } from '../entities/activitypub-server.entity';
import {
	KNOWN_SOFTWARE,
	InstanceApi_CustomEmojiDTO,
} from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/routes/instance';

class ActivityPubService {
	/**
	 * Syncs the nodeinfo and software
	 * for a subdomain
	 * @param db
	 * @param urlLike
	 */
	static async syncSoftware(
		db: Realm,
		urlLike: string,
	): Promise<ActivityPubServer> {
		let match = ActivityPubServerRepository.get(db, urlLike);
		const x = new UnknownRestClient();

		/**
		 * either instance info is not cached
		 * or, neither nodeinfo nor software
		 * info is available
		 * */
		if (
			!match ||
			(match && (!match.nodeinfo || !match.instanceSoftwareLastFetchedAt))
		) {
			const { data: nodeinfoData, error: nodeinfoError } =
				await x.instances.getNodeInfo(urlLike);

			if (nodeinfoError) {
				console.log('[WARN]: error fetching nodeinfo for', urlLike);
				return;
			}
			match = db.write(() => {
				return ActivityPubServerRepository.updateNodeInfo(
					db,
					urlLike,
					nodeinfoData,
				);
			});
		}

		/**
		 * either the software type is not resolved
		 * or it is of type unknown
		 */
		if ((match && !match.type) || match.type === KNOWN_SOFTWARE.UNKNOWN) {
			const { data: softwareData, error: softwareError } =
				await x.instances.getSoftware(match.nodeinfo);
			if (softwareError) {
				console.log('[WARN]: error fetching software for', urlLike);
				return;
			}

			match = db.write(() => {
				return ActivityPubServerRepository.updateSoftwareType(db, {
					type: softwareData.software,
					url: urlLike,
					description: 'N/A',
				});
			});
		}
		return match;
	}

	/**
	 * Try fetching custom emojis
	 *
	 * Supported: Mastodon/Misskey API Spec
	 * @param db
	 * @param instance
	 * @param software if, already known
	 */
	static async fetchEmojisAndInstanceSoftware(
		db: Realm,
		instance: string,
		software?: string,
	): Promise<{
		emojis: InstanceApi_CustomEmojiDTO[];
		software: string;
	} | null> {
		const x = new UnknownRestClient();

		if (!software) {
			const { data, error } = await x.instances.getSoftwareInfo(instance);
			if (error) {
				console.log('[WARN]: software query failed', instance, error.code);
				return null;
			}
			software = data.software;
		}

		const { data: emojis, error: emojiError } =
			await x.instances.getCustomEmojis(instance, software);

		if (emojiError) {
			console.log('[WARN]: emoji query failed', emojiError);
			return null;
		}

		return { emojis, software };
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

	static async boost(
		client: ActivityPubClient,
		id: string,
		localState: boolean,
	) {}

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
	 * @param db
	 */
	static async signInUrl(urlLike: string, db: MMKV) {
		const tokens = MmkvService.getMastodonClientTokens(db, urlLike);

		const client = new UnknownRestClient();
		const { data, error } = await client.instances.getLoginUrl(urlLike, {
			appCallback: 'https://example.com/',
			appName: 'Dhaaga',
			appClientId: tokens?.clientId,
			appClientSecret: tokens?.clientSecret,
			uuid: Crypto.randomUUID(),
		});
		if (error) return null;
		return data;
	}

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
}

export default ActivityPubService;
