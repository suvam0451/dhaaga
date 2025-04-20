import { DataSource, Account } from '@dhaaga/db';
import { BaseStorageManager } from './_shared';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/bridge';
import {
	ActivityPubReactionsService,
	ActivityPubReactionStateType,
} from '@dhaaga/bridge';
import { UserObjectType } from '@dhaaga/bridge';

enum KEY {
	APP_ACCOUNT_USER_OBJECT_CACHE = 'app/_cache/account/:uuid',
}

class Storage extends BaseStorageManager {
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
	serverReactionCache: InstanceApi_CustomEmojiDTO[];

	constructor(db: DataSource, acct: Account) {
		this.db = db;
		this.storage = new Storage();
		this.acct = acct;
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
	): InstanceApi_CustomEmojiDTO | null {
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
}

export default AccountSessionManager;
