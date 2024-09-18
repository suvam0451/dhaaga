import type { MMKV } from 'react-native-mmkv';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubStatusAppDtoType } from './approto/app-status-dto.service';

export type BottomSheetProp_HashtagType = {
	name: string;
	remoteInstance: string;
};

const CACHE_KEY_BOTTOM_SHEET_PROP_STATUS = 'global-prop/bottom-sheet/status';
const CACHE_KEY_BOTTOM_SHEET_PROP_LINK = 'global-prop/bottom-sheet/link';
const CACHE_KEY_BOTTOM_SHEET_PROP_HASHTAG = 'global-prop/bottom-sheet/hashtag';

export type BottomSheetProp_LinkType = {
	url: string;
	displayName: string;
};

class GlobalMmkvCacheService {
	private static set(db: MMKV, key: string, value: any) {
		db.set(key, value);
	}

	private static get(db: MMKV, key: string) {
		return db.getString(key);
	}

	static setBottomSheetProp_Hashtag(
		db: MMKV,
		dto: BottomSheetProp_HashtagType,
	) {
		this.set(db, CACHE_KEY_BOTTOM_SHEET_PROP_HASHTAG, JSON.stringify(dto));
	}

	static getBottomSheetProp_Hashtag(
		db: MMKV,
	): BottomSheetProp_HashtagType | null {
		const res = this.get(db, CACHE_KEY_BOTTOM_SHEET_PROP_HASHTAG);
		if (!res) return null;
		return JSON.parse(res);
	}

	static setBottomSheetProp_Link(db: MMKV, dto: BottomSheetProp_LinkType) {
		this.set(db, CACHE_KEY_BOTTOM_SHEET_PROP_LINK, JSON.stringify(dto));
	}

	static getBottomSheetProp_Link(db: MMKV): BottomSheetProp_LinkType {
		const res = this.get(db, CACHE_KEY_BOTTOM_SHEET_PROP_LINK);
		if (!res) return null;
		return JSON.parse(res);
	}

	static setBottomSheetProp_Status(db: MMKV, dto: ActivityPubStatusAppDtoType) {
		this.set(db, CACHE_KEY_BOTTOM_SHEET_PROP_STATUS, JSON.stringify(dto));
	}

	static getBottomSheetProp_Status(db: MMKV): ActivityPubStatusAppDtoType {
		const res = this.get(db, CACHE_KEY_BOTTOM_SHEET_PROP_STATUS);
		if (!res) return null;
		return JSON.parse(res);
	}

	static saveEmojiCacheForInstance(
		db: MMKV,
		instance: string,
		items: InstanceApi_CustomEmojiDTO[],
	) {
		this.set(
			db,
			`emojis/${instance}`,
			JSON.stringify({
				data: items,
				lastFetchedAt: new Date(),
			}),
		);
		return items;
	}

	static getEmojiCacheForInstance(
		db: MMKV,
		instance: string,
	): {
		data: InstanceApi_CustomEmojiDTO[];
		lastFetchedAt: Date;
	} | null {
		try {
			const res = this.get(db, `emojis/${instance}`);
			if (!res) return null;
			return JSON.parse(res);
		} catch (e) {
			return null;
		}
	}
}

export default GlobalMmkvCacheService;
