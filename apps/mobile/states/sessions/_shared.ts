import Storage from 'expo-sqlite/kv-store';
import { z } from 'zod';

const savedObjectWithExpiry = z.object({
	updatedAt: z.coerce.date(),
	value: z.any(),
});

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

	printAllKeys() {
		console.log(Storage.getAllKeysSync());
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

	setJsonWithExpiry(key: string, value: any) {
		this.set(key, JSON.stringify({ updatedAt: new Date(), value }));
	}

	getJsonWithExpiry<T>(key: string, invalidAfter: Date): T | null {
		const saved = this.get(key);
		if (!saved) return null;

		try {
			const parsed = JSON.parse(saved);
			const { success, error, data } = savedObjectWithExpiry.safeParse(parsed);
			console.log('zod results', success, error, data.updatedAt, invalidAfter);
			if (error) return null;
			if (new Date(data.updatedAt) < new Date(invalidAfter)) return null;
			return data.value;
		} catch (e) {
			return null;
		}
	}
}
