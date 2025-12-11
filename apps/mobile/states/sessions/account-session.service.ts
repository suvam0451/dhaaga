import {
	DataSource,
	Account,
	KnownServer,
	KnownServerService,
} from '@dhaaga/db';
import { BaseStorageManager } from './_shared';
import {
	ActivityPubReactionsService,
	ActivityPubReactionStateType,
	BaseApiAdapter,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import type { UserObjectType, CustomEmojiObjectType } from '@dhaaga/bridge';

enum KEY {
	APP_ACCOUNT_USER_OBJECT_CACHE = 'app/_cache/account/:uuid',
}

class Storage extends BaseStorageManager {
	getEmojis(server: string) {
		return this.getJson<{
			data: CustomEmojiObjectType[];
			lastFetchedAt: Date;
		}>(`emojis/${server}`);
	}

	setEmojis(server: string, data: CustomEmojiObjectType[]) {
		this.setJson(`emojis/${server}`, {
			data,
			lastFetchedAt: new Date(),
		});
	}

	getProfile(acctUuid: string) {
		return this.getJson<{
			updatedAt: string;
			value: UserObjectType;
		}>(KEY.APP_ACCOUNT_USER_OBJECT_CACHE.toString().replace(':uuid', acctUuid));
	}

	setProfile(acctUuid: string, data: UserObjectType) {
		this.setJsonWithExpiry(
			KEY.APP_ACCOUNT_USER_OBJECT_CACHE.toString().replace(':uuid', acctUuid),
			data,
		);
	}
}

class AccountSessionManager {
	db: DataSource;
	storage: Storage;
	acct: Account;
	serverReactionCache: CustomEmojiObjectType[];
	customEmojis: CustomEmojiObjectType[];

	constructor(db: DataSource, acct: Account) {
		this.db = db;
		this.storage = new Storage();
		this.acct = acct;
		this.serverReactionCache = [];
		this.customEmojis = [];
	}

	loadReactions() {
		if (this.serverReactionCache && this.serverReactionCache.length > 0) return;
		const allEmojis = this.storage.getEmojis(this.acct.server);
		if (!allEmojis) {
			this.serverReactionCache = [];
		} else {
			this.serverReactionCache = allEmojis.data;
		}
	}

	resolveEmoji(
		id: string,
		emojiMap: Map<string, string>,
	): CustomEmojiObjectType | null {
		// avoid storage reads
		let store = null;

		if (emojiMap?.has(id)) {
			return {
				url: emojiMap.get(id),
				shortCode: id,
				aliases: [],
				tags: [],
				staticUrl: emojiMap.get(id),
				visibleInPicker: true,
			};
		}

		if (this.serverReactionCache) {
			store = this.serverReactionCache;
			if (!store) return null;
		} else {
			const allEmojis = this.storage.getEmojis(this.acct.server);
			if (!allEmojis) return null;
			store = allEmojis.data;
		}
		const found = store.find((o) => o.shortCode === id);
		if (!found) {
			console.log('emoji not resolved for', id, emojiMap);
		}
		return found;
	}

	/**
	 * @param reactions the reaction list object from misskey
	 * @param preCalculated some reactions are resolved automatically
	 * by the app dto converters
	 */
	resolveReactions(
		reactions: ActivityPubReactionStateType,
		preCalculated: {
			url?: string;
			width?: number;
			height?: number;
			name?: string;
		}[],
	) {
		let store = this.serverReactionCache;
		if (!store) {
			const allEmojis = this.storage.getEmojis(this.acct.server);
			if (!allEmojis) {
				store = [];
			} else {
				store = allEmojis.data;
			}
		}

		return ActivityPubReactionsService.renderData(reactions, {
			me: this.acct.identifier,
			calculated: preCalculated,
			cache: store,
		});
	}

	/**
	 * Loads custom emojis for the
	 * server the account belongs to
	 */
	async loadCustomEmojis(debug = false) {
		const _server = this.acct.server;

		// Not Supported
		if (this.acct.driver === KNOWN_SOFTWARE.BLUESKY) return;

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

	/**
	 * load custom emojis for a server
	 * @param server if loading emojis for a remote server
	 */
	async downloadInstanceEmojis(server?: string) {
		const _server = server || this.acct.server;

		const now = new Date();
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);

		const has = this.storage.getEmojis(_server);

		if (has) {
			const isExpired = new Date(has.lastFetchedAt) <= oneWeekAgo;
			const isEmpty = has.data.length === 0;
			if (!isExpired && !isEmpty) return has.data;
		}

		const serverRecord = await this.fetchInstanceData(_server);
		if (!serverRecord) return;
		const _url = serverRecord.server;

		const x = new BaseApiAdapter();
		const data = await x.instances.getCustomEmojis(_url);

		this.storage.setJson(`emojis/${_url}`, {
			data,
			lastFetchedAt: new Date(),
		});
		this.storage.setEmojis(_url, data);
		if (this.acct.server === _server) {
		}
		return data;
	}

	async fetchInstanceData(server?: string): Promise<KnownServer | null> {
		const serverRecord = KnownServerService.getByUrl(this.db, server);
		if (serverRecord && serverRecord.driver !== KNOWN_SOFTWARE.UNKNOWN)
			return serverRecord;
		if (!serverRecord || serverRecord.driver === KNOWN_SOFTWARE.UNKNOWN) {
			const x = new BaseApiAdapter();
			const softwareInfoResult = await x.instances.getSoftwareInfo(server);
			if (softwareInfoResult) {
				KnownServerService.upsert(this.db, {
					url: server,
					driver: softwareInfoResult.software,
				});
			}
		}
		return KnownServerService.getByUrl(this.db, server);
	}
}

export default AccountSessionManager;
