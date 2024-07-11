import axios from 'axios';
import { ActivityPubCustomEmojiItemDTO } from '../entities/activitypub-emoji.entity';
import { UnknownRestClient } from '@dhaaga/shared-abstraction-activitypub';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';

class ActivityPubService {
	/**
	 * Try fetching custom emojis
	 *
	 * Supported: Mastodon/Misskey API Spec
	 * @param instance
	 */
	static async fetchEmojisAndInstanceSoftware(instance: string): Promise<{
		emojis: InstanceApi_CustomEmojiDTO[];
		software: string;
	} | null> {
		const x = new UnknownRestClient();
		return x.instances
			.getSoftwareInfo(instance)
			.then(async ({ data, error }) => {
				if (!error) {
					try {
						let result0 = await x.instances.getCustomEmojis(
							instance,
							data.software,
						);
						const { data: emojiData, error: emojiError } = result0;
						if (!emojiError) {
							return { emojis: emojiData, software: data.software };
						} else {
							console.log('[WARN]: emoji query failed', emojiError);
							return { emojis: [], software: data.software };
						}
					} catch (e) {
						console.log('[WARN]: emoji query failed', e);
						return null;
					}
				} else {
					console.log('[WARN]: software query failed', instance, error.code);
					return null;
				}
			})
			.catch((e) => {
				console.log('[WARN]: error determining software', instance, e);
				return null;
			});
	}
}

export default ActivityPubService;
