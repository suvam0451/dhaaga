import Storage from 'expo-sqlite/kv-store';

/**
 * Provides basic data storage/retrieval
 * functionalities for kv-store
 *
 * Each session manager inherit from this and
 * implement their necessary functions
 */
export class BaseStorageManager {
	get(key: string) {
		try {
			return Storage.getItemSync(key);
		} catch (e) {
			return null;
		}
	}

	set(key: string, value: any) {
		Storage.setItemSync(key, value);
	}

	getJson<T>(key: string): T | null {
		const data = this.get(key);
		if (!data) return null;
		try {
			return JSON.parse(data) as T;
		} catch (e) {
			console.log(`[WARN]: kv storage read error`, e);
			return null;
		}
	}

	setJson(key: string, value: any) {
		this.set(key, JSON.stringify(value));
	}
}
