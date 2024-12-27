import { DataSource } from '../../database/dataSource';
import { BaseStorageManager } from './_shared';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub';
import { Account } from '../../database/_schema';
import ActivityPubReactionsService, {
	ActivityPubReactionStateDtoType,
} from '../approto/activitypub-reactions.service';

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

	resolveEmoji(
		id: string,
		emojiMap: Map<string, string>,
	): InstanceApi_CustomEmojiDTO | null {
		// avoid storage reads
		let store = null;

		if (emojiMap.has(id)) {
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
		reactions: ActivityPubReactionStateDtoType,
		preCalculated: {
			url?: string;
			width?: number;
			height?: number;
			name?: string;
		}[],
	) {
		return ActivityPubReactionsService.renderData(reactions, {
			me: this.acct.identifier,
			calculated: preCalculated,
			cache: this.serverReactionCache || [],
		});
	}
}

export default AccountSessionManager;
