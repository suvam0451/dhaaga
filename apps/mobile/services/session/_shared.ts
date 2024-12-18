import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

/**
 * Provides basic data storage/retrieval
 * functionalities for AsyncStorage
 *
 * Each session manager inherit from this and
 * implement their necessary functions
 */
export class BaseStorageManager {
	async get(key: string) {
		try {
			return await AsyncStorage.getItem(key);
		} catch (e) {
			return null;
		}
	}

	async set(key: string, value: any) {
		await AsyncStorage.setItem(key, value);
	}

	async getJson<T>(key: string): Promise<T | null> {
		const data = await this.get(key);
		if (!data) return null;
		try {
			return JSON.parse(data) as T;
		} catch (e) {
			console.log(`[WARN]: cache read error`, e);
			return null;
		}
	}

	async setJson(key: string, value: any) {
		await this.set(key, JSON.stringify(value));
	}
}

/**
 * Provides basic data storage/retrieval
 * functionalities for MMKV
 *
 * Each session manager inherit from this and
 * implement their necessary functions
 */
export class BaseCacheManager {
	mmkv: MMKV;

	constructor(mmkv: MMKV) {
		this.mmkv = mmkv;
	}

	set(key: string, value: any) {
		this.mmkv.set(key, value);
	}

	get(key: string) {
		return this.mmkv.getString(key);
	}

	getJson<T>(key: string): T | null {
		const data = this.get(key);
		if (!data) return null;
		try {
			return JSON.parse(data) as T;
		} catch (e) {
			console.log(`[WARN]: cache read error`, e);
			return null;
		}
	}

	setJson(key: string, value: any) {
		this.set(key, JSON.stringify(value));
	}
}
