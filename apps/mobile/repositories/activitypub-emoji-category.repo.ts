import { ActivityPubCustomEmojiCategory } from '../entities/activitypub-emoji-category.entity';
import { ActivityPubCustomEmojiItem } from '../entities/activitypub-emoji.entity';
import { SQLiteDatabase } from 'expo-sqlite';

export class ActivityPubCustomEmojiCategoryRepository {
	static pushEmoji(
		db: SQLiteDatabase,
		target: ActivityPubCustomEmojiCategory,
		emoji: ActivityPubCustomEmojiItem,
	) {
		// const conflict = target.emojis.find(
		// 	// (o) => o._id.toString() === emoji._id.toString(),
		// );
		// if (!conflict) {
		// 	target.emojis.push(emoji);
		// }
	}

	static pushEmojis(
		db,
		target: ActivityPubCustomEmojiCategory,
		emojis: ActivityPubCustomEmojiCategory[],
	) {}

	static addCategories(db, items: string[]) {
		for (let i = 0; i < items.length; i++) {
			const category = items[i];
			const conflict = this.search(db, category);
			// db.create(
			// 	ActivityPubCustomEmojiCategory,
			// 	{
			// 		_id: conflict?._id || new Realm.BSON.UUID(),
			// 		name: category,
			// 	},
			// 	UpdateMode.Modified,
			// );
		}
	}

	static upsert(db, category: string) {
		const conflict = this.search(db, category);

		// return db.create(
		// 	ActivityPubCustomEmojiCategory,
		// 	{
		// 		_id: conflict?._id || new Realm.BSON.UUID(),
		// 		name: category,
		// 	},
		// 	UpdateMode.Modified,
		// );
	}

	static search(db: SQLiteDatabase, category: string) {
		// return db
		// 	.objects(ActivityPubCustomEmojiCategory)
		// 	.find((o) => o.name === category);
	}
}
