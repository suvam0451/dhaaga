import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub';
import { SQLiteDatabase } from 'expo-sqlite';
import { Server } from '../database/_schema';

export class ActivityPubCustomEmojiRepository {
	static upsertMany(
		db: SQLiteDatabase,
		items: InstanceApi_CustomEmojiDTO[],
		server: Server,
	) {
		for (let i = 0; i < items.length; i++) {
			this.upsert(db, items[i], server);
		}
	}

	/**
	 * Upserts emoji item and appends it to it's category
	 * @param db
	 * @param item
	 * @param server
	 */
	static upsert(
		db: SQLiteDatabase,
		item: InstanceApi_CustomEmojiDTO,
		server: Server,
	) {
		const conflict = this.search(db, item.shortCode, server.url);
		// const savedEmojiItem = db.create(
		// 	ActivityPubCustomEmojiItem,
		// 	{
		// 		_id: conflict?._id || new Realm.BSON.UUID(),
		// 		shortcode: item.shortCode,
		// 		aliases: item.aliases,
		// 		url: item.url,
		// 		staticUrl: item.staticUrl,
		// 		visibleInPicker: item.visibleInPicker,
		// 		server,
		// 	},
		// 	UpdateMode.Modified,
		// );

		if (item.category) {
		} else {
		}
		// ActivityPubServerRepository.addEmoji(db, savedEmojiItem, server);
	}

	static search(db, shortcode: string, instance: string) {
		if (!instance) return null;
		// const server = ActivityPubServerRepository.get(db, instance);
		// return server?.emojis?.find((o) => o.shortcode === shortcode);
	}
}
