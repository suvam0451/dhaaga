import {
	ActivityPubServer,
	ActivityPubServerCreateDTO,
} from '../entities/activitypub-server.entity';
import { SQLiteDatabase } from 'expo-sqlite';

export class ActivityPubServerRepository {
	db: SQLiteDatabase;
	// constructor(db: Realm) {
	// 	this.db = db;
	// }

	static create(db: SQLiteDatabase) {
		// return new ActivityPubServerRepository(db);
	}

	get(subdomain: string) {
		// return ActivityPubServerRepository.get(this.db, subdomain);
	}

	/**
	 * add an ActivityPub server to list of known servers
	 */
	static upsert(
		db: SQLiteDatabase,
		url: string,
		software?: string,
	): ActivityPubServer | null {
		if (!url) return null;
		const removeHttps = url.replace(/^https?:\/\//, '');

		const match = this.get(db, removeHttps);
		try {
			// return db.create(
			// 	ActivityPubServer,
			// 	{
			// 		_id: match?._id || new Realm.BSON.UUID(),
			// 		url: match?.url || removeHttps,
			// 		description: match?.description || 'N/A',
			// 		type: software ? software : match?.type || 'unknown',
			// 	},
			// 	UpdateMode.Modified,
			// );
		} catch (e) {
			console.log('[ERROR]: server upsert failed', e);
			return null;
		}
	}

	static checkEmojiReactionRetryPolicy(db: SQLiteDatabase) {}
	/**
	 * Updates the detected software for this server
	 * (Always) Inserts new record, if not exists
	 * Skips if detected software is "unknown"
	 */
	static updateSoftwareType(
		db: SQLiteDatabase,
		dto: ActivityPubServerCreateDTO,
	) {
		return this.upsert(db, dto.url, dto.type);
	}

	static updateNodeInfo(db: SQLiteDatabase, urlLike: string, nodeinfo: string) {
		const _server = this.upsert(db, urlLike);
		_server.nodeinfo = nodeinfo;
		return _server;
	}

	static get(db: SQLiteDatabase, url: string) {
		url = url.replace(/^https?:\/\//, '');
		// return db
		// 	.objects(ActivityPubServer)
		// 	.find((o: ActivityPubServer) => o?.url === url);
	}
}
