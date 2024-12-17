import { DataSource } from '../database/dataSource';
import {
	Account,
	AccountProfile,
	ProfileKnownServer,
} from '../database/_schema';
import { MMKV } from 'react-native-mmkv';
import {
	ActivityPubClient,
	InstanceApi_CustomEmojiDTO,
	KNOWN_SOFTWARE,
	UnknownRestClient,
} from '@dhaaga/shared-abstraction-activitypub';
import { ProfileKnownServerService } from '../database/entities/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountService } from '../database/entities/account';
import { AccountProfileService } from '../database/entities/profile';

/**
 * ---- Storage Interfaces ----
 */

interface AppStorageInterface {}

class StorageManager implements AppStorageInterface {
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

class CacheManager {
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

	getEmojis(server: string) {
		return this.getJson<{
			data: InstanceApi_CustomEmojiDTO[];
			lastFetchedAt: Date;
		}>(`emojis/${server}`);
	}

	setEmojis(server: string, data: InstanceApi_CustomEmojiDTO[]) {
		this.setJson(`emojis/${server}`, {
			data,
			lastFetchedAt: new Date(),
		});
	}
}

/**
 * ----------------------
 */

/**
 *	Class to manage Non-Reactive state
 *
 * e.g. - fetching and storing remote data
 * e.g. - caching emojis
 */
class ProfileSessionManager {
	acct: Account;
	profile: AccountProfile;
	// databases
	db: DataSource;
	mmkv: MMKV;
	// api clients
	client: ActivityPubClient;

	storageManager: StorageManager;
	cacheManager: CacheManager;
	customEmojis: InstanceApi_CustomEmojiDTO[];

	constructor(db: DataSource, mmkv: MMKV) {
		this.db = db;
		this.mmkv = mmkv;
		this.storageManager = new StorageManager();
		this.cacheManager = new CacheManager(this.mmkv);

		this.acct = AccountService.getSelected(this.db);
		this.profile = AccountProfileService.getActiveProfile(this.db, this.acct);
		this.customEmojis = [];
	}

	/**
	 * Loads custom emojis for the
	 * server the account belongs to
	 */
	async loadCustomEmojis(debug = false) {
		const _server = this.acct.server;
		const emojis = await this.downloadInstanceEmojis(_server);
		if (emojis) {
			if (debug)
				console.log(
					'[INFO]: custom emojis loaded successfully',
					_server,
					emojis.length,
				);

			this.customEmojis = emojis;
		} else {
			if (debug)
				console.log('[WARN]: custom emojis failed to load', this.acct.server);
		}
	}

	async fetchInstanceData(server?: string): Promise<ProfileKnownServer | null> {
		const serverRecord = ProfileKnownServerService.getByUrl(
			this.db,
			this.profile,
			server,
		);
		if (serverRecord && serverRecord.driver !== KNOWN_SOFTWARE.UNKNOWN)
			return serverRecord;
		if (!serverRecord || serverRecord.driver === KNOWN_SOFTWARE.UNKNOWN) {
			const x = new UnknownRestClient();
			const softwareInfoResult = await x.instances.getSoftwareInfo(server);
			if (softwareInfoResult.error) {
				console.log('[WARN]: failed to fetch server info', server);
				return null;
			}
			ProfileKnownServerService.upsert(this.db, this.profile, {
				url: server,
				driver: softwareInfoResult.data.software,
			});
		}
		return ProfileKnownServerService.getByUrl(this.db, this.profile, server);
	}

	/**
	 * load custom emojis for a server
	 * @param server if loading emojis for a remote server
	 */
	async downloadInstanceEmojis(server?: string) {
		const _server = server || this.acct.server;

		const now = new Date();
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);

		const has = this.cacheManager.getEmojis(_server);

		if (has) {
			const isExpired = new Date(has.lastFetchedAt) <= oneWeekAgo;
			const isEmpty = has.data.length === 0;
			if (!isExpired && !isEmpty) return has.data;
		}

		const serverRecord = await this.fetchInstanceData(_server);
		if (!serverRecord) return;
		const _url = serverRecord.url;

		const x = new UnknownRestClient();
		const { data, error } = await x.instances.getCustomEmojis(_url);
		if (error) {
			console.log('[WARN]: failed to get emojis');
			return null;
		}

		await this.storageManager.setJson(`emojis/${_url}`, {
			data: data,
			lastFetchedAt: new Date(),
		});
		this.cacheManager.setEmojis(_url, data);
		if (this.acct.server === _server) {
		}
		return data;
	}
}

export default ProfileSessionManager;
