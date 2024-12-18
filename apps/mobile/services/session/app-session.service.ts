import { BaseCacheManager, BaseStorageManager } from './_shared';
import { z } from 'zod';
import { DataSource } from '../../database/dataSource';
import { MMKV } from 'react-native-mmkv';

enum APP_CACHE_KEY {
	LINK_TARGET = 'app/_cache/bottomSheet_linkTarget',
	TAG_TARGET = 'app/_cache/bottomSheet_tagTarget',
}

/**
 * ---- Typings ----
 */

const AppLinkTargetDto = z.object({
	url: z.string(),
	displayName: z.string().optional().nullable(),
});

type AppLinkTargetType = z.infer<typeof AppLinkTargetDto>;

/**
 * ---- Storage Interfaces ----
 */

class Storage extends BaseStorageManager {}

class Cache extends BaseCacheManager {
	getLinkTarget(): AppLinkTargetType {
		return this.getJson(APP_CACHE_KEY.LINK_TARGET);
	}

	setLinkTarget(url: string, displayName: string) {
		this.setJson(APP_CACHE_KEY.LINK_TARGET, {
			url,
			displayName,
		});
	}

	getTagTarget() {
		return this.get(APP_CACHE_KEY.TAG_TARGET);
	}

	setTagTarget(value: string) {
		return this.set(APP_CACHE_KEY.TAG_TARGET, value);
	}
}

class AppSessionManager {
	// databases
	db: DataSource;
	mmkv: MMKV;

	storage: Storage;
	cache: Cache;

	constructor(db: DataSource, mmkv: MMKV) {
		this.db = db;
		this.mmkv = mmkv;
		this.storage = new Storage();
		this.cache = new Cache(this.mmkv);
	}
}

export default AppSessionManager;
