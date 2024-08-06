import {
	ActivityPubClient,
	UnknownRestClient,
} from '@dhaaga/shared-abstraction-activitypub';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import * as Crypto from 'expo-crypto';
import { MMKV } from 'react-native-mmkv';
import MmkvService from './mmkv.service';

class ActivityPubService {
	/**
	 * Try fetching custom emojis
	 *
	 * Supported: Mastodon/Misskey API Spec
	 * @param instance
	 * @param software if, already known
	 */
	static async fetchEmojisAndInstanceSoftware(
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

	static async toggleBookmark(client: ActivityPubClient, localState: boolean) {}

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
}

export default ActivityPubService;
