import { ActivityPubTagCreateDTO } from '../entities/activitypub-tag.entity';
import { SQLiteDatabase } from 'expo-sqlite';

export class ActivityPubTagRepository {
	static cleanAll(db: SQLiteDatabase) {
		// db.delete(db.objects(ActivityPubTag));
	}

	static clearFollowing(db: SQLiteDatabase) {
		// const all = db.objects(ActivityPubTag);
		// all.forEach((o) => {
		// 	o.following = false;
		// });
	}

	static updateFollowStatus() {}

	static applyFollowing(db: SQLiteDatabase, dto: any[]) {
		// const all = db.objects(ActivityPubTag);
		// const mapper = new Map<string, ActivityPubTag>();
		// all.forEach((o) => {
		// 	mapper.set(o.name, o);
		// });
		//
		// dto.forEach((o) => {
		// 	const match = mapper.get(o.name);
		// 	if (match) {
		// 		match.following = o.following;
		// 	} else {
		// 		this.upsert(db, {
		// 			name: o.name,
		// 			following: o.following,
		// 			privatelyFollowing: false,
		// 		});
		// 	}
		// });
	}

	/**
	 * Will not mess up the follow status
	 * @param db
	 * @param name
	 */
	static upsertByName(db: SQLiteDatabase, name: string) {
		// name = name.toLowerCase();
		// const conflict = this.find(db, name);
		// return db.create(
		// 	ActivityPubTag,
		// 	{
		// 		_id: conflict?._id || new Realm.BSON.UUID(),
		// 		name,
		// 		following: conflict?.following || false,
		// 		privatelyFollowing: conflict?.privatelyFollowing || false,
		// 	},
		// 	UpdateMode.Modified,
		// );
	}

	static upsert(db: SQLiteDatabase, dto: ActivityPubTagCreateDTO) {
		// const name = dto.name.toLowerCase();
		// const conflict = this.find(db, name);
		// return db.create(
		// 	ActivityPubTag,
		// 	{
		// 		_id: conflict?._id || new Realm.BSON.UUID(),
		// 		name,
		// 		following: dto.following,
		// 		privatelyFollowing: dto.privatelyFollowing,
		// 	},
		// 	UpdateMode.Modified,
		// );
	}

	static find(db: SQLiteDatabase, name: string) {
		// return db
		// 	.objects(ActivityPubTag)
		// 	.find((o: ActivityPubTag) => o.name === name);
	}
}
