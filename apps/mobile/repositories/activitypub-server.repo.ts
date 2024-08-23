import {
	ActivityPubServer,
	ActivityPubServerCreateDTO,
} from '../entities/activitypub-server.entity';
import { Realm } from 'realm';
import { ActivityPubCustomEmojiItem } from '../entities/activitypub-emoji.entity';
import { UpdateMode } from 'realm';

export class ActivityPubServerRepository {
	/**
	 * add an ActivityPub server to list of known servers
	 */
	static upsert(
		db: Realm,
		url: string,
		software?: string,
	): ActivityPubServer | null {
		if (!url) return null;
		const removeHttps = url.replace(/^https?:\/\//, '');

		const match = this.get(db, removeHttps);
		try {
			return db.create(
				ActivityPubServer,
				{
					_id: match?._id || new Realm.BSON.UUID(),
					url: match?.url || removeHttps,
					description: match?.description || 'N/A',
					type: software ? software : match?.type || 'unknown',
				},
				UpdateMode.Modified,
			);
		} catch (e) {
			console.log('[ERROR]: server upsert failed', e);
			return null;
		}
	}

	/**
	 * Updates the detected software for this server
	 * (Always) Inserts new record, if not exists
	 * Skips if detected software is "unknown"
	 */
	static updateSoftwareType(db: Realm, dto: ActivityPubServerCreateDTO) {
		return this.upsert(db, dto.url, dto.type);
	}

	static updateNodeInfo(db: Realm, urlLike: string, nodeinfo: string) {
		const _server = this.upsert(db, urlLike);
		_server.nodeinfo = nodeinfo;
		return _server;
	}

	static addEmoji(
		db: Realm,
		emoji: ActivityPubCustomEmojiItem,
		server: ActivityPubServer,
	) {
		const _server = this.upsert(db, server.url);
		if (!_server.emojis.find((o) => o.shortcode === emoji.shortcode)) {
			_server.emojis.push(emoji);
		}
	}

	static get(db: Realm, url: string): ActivityPubServer {
		url = url.replace(/^https?:\/\//, '');
		return db
			.objects(ActivityPubServer)
			.find((o: ActivityPubServer) => o?.url === url);
	}
}
