// import { Realm } from '@realm/react';
import { ActivityPubCustomEmojiItem } from '../entities/activitypub-emoji.entity';
import { ActivityPubServer } from '../entities/activitypub-server.entity';
import { ActivityPubCustomEmojiCategoryRepository } from './activitypub-emoji-category.repo';
// import { UpdateMode } from 'realm';
import { ActivityPubServerRepository } from './activitypub-server.repo';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub';

export class ActivityPubCustomEmojiRepository {
	static clearAll(db) {
		db.delete(db.objects(ActivityPubCustomEmojiItem));
	}

	static upsertMany(
		db,
		items: InstanceApi_CustomEmojiDTO[],
		server: ActivityPubServer,
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
		db,
		item: InstanceApi_CustomEmojiDTO,
		server: ActivityPubServer,
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
			// const category = ActivityPubCustomEmojiCategoryRepository.upsert(
			// 	db,
			// 	item.category,
			// );
			// ActivityPubCustomEmojiCategoryRepository.pushEmoji(
			// 	db,
			// 	category,
			// 	savedEmojiItem,
			// );
		} else {
			// const categoryNotFound = ActivityPubCustomEmojiCategoryRepository.upsert(
			// 	db,
			// 	'Category:404',
			// );
			// ActivityPubCustomEmojiCategoryRepository.pushEmoji(
			// 	db,
			// 	categoryNotFound,
			// 	savedEmojiItem,
			// );
		}
		// ActivityPubServerRepository.addEmoji(db, savedEmojiItem, server);
	}

	static search(db, shortcode: string, instance: string) {
		if (!instance) return null;
		// const server = ActivityPubServerRepository.get(db, instance);
		// return server?.emojis?.find((o) => o.shortcode === shortcode);
	}
}
