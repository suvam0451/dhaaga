import type { MMKV } from 'react-native-mmkv';
import {
	ActivitypubStatusAdapter,
	StatusInterface,
} from '@dhaaga/shared-abstraction-activitypub';

class MmkvService {
	private static set(db: MMKV, key: string, value: any) {
		db.set(key, value);
	}

	private static get(db: MMKV, key: string) {
		return db.getString(key);
	}

	static saveRawStatuses(db: MMKV, statuses: StatusInterface[]) {
		for (const status of statuses) {
			this.set(
				db,
				`/status/${status.getRaw().id}`,
				JSON.stringify(status.getRaw()),
			);
		}
	}

	static getStatusRaw(db: MMKV, id: string) {
		const item = this.get(db, `/status/${id}`);
		if (!item) return null;
		return JSON.parse(item);
	}

	static getStatusInterface(
		db: MMKV,
		id: string,
		domain: string,
	): StatusInterface {
		const item = this.get(db, `/status/${id}`);
		if (!item) return ActivitypubStatusAdapter(null, domain);
		return ActivitypubStatusAdapter(JSON.parse(item), domain);
	}
}

export default MmkvService;
