import {
	ActivityPubServer,
	ActivityPubServerCreateDTO,
} from '../entities/activitypub-server.entity';
import { Realm } from '@realm/react';
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
	}

	/**
	 * Updates the detected software for this server
	 * (Always) Inserts new record, if not exists
	 * Skips if detected software is "unknown"
	 */
	static updateSoftwareType(db: Realm, dto: ActivityPubServerCreateDTO) {
		this.upsert(db, dto.url, dto.type);
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

	static get(db: Realm, url: string) {
		url = url.replace(/^https?:\/\//, '');
		return db.objects(ActivityPubServer).find((o) => o.url === url);
	}
}
