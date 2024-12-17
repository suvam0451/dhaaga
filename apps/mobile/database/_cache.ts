import type { MMKV } from 'react-native-mmkv';
import { Result } from '../utils/result';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub';

export class AppMmkvInstance {
	db: MMKV;

	constructor(db: MMKV) {
		this.db = db;
	}

	private set(key: string, value: any) {
		this.db.set(key, value);
	}

	private get(key: string) {
		return this.db.getString(key);
	}

	getEmojiCacheForServer(
		server: string,
	): Result<{ data: InstanceApi_CustomEmojiDTO[]; lastFetchedAt: Date }> {
		try {
			const res = this.get(`emojis/${server}`);
			if (!res) return { type: 'not-found' };
			return { type: 'success', value: JSON.parse(res) };
		} catch (e) {
			return { type: 'error', error: e };
		}
	}

	setEmojiCacheForServer(
		instance: string,
		items: InstanceApi_CustomEmojiDTO[],
	) {
		this.set(
			`emojis/${instance}`,
			JSON.stringify({
				data: items,
				lastFetchedAt: new Date(),
			}),
		);
		return items;
	}
}
