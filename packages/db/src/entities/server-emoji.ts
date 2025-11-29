import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import { KnownServer, type ServerEmoji } from '../_schema.js';
import { DbErrorCode, type DbResult, Err, Ok } from '../utils/db-result.js';
import { DATABASE_NAME } from '../types/db.types.js';

class Repo {
	/**
	 * @param serverId fk
	 * @param identifier shortCode/alias of the reaction
	 */
	static find(serverId: number, identifier: string): DbResult<ServerEmoji> {
		const db = SQLite.openDatabaseSync(DATABASE_NAME);

		try {
			const emoji = db.getFirstSync<ServerEmoji>(
				`select * from serverEmoji where serverId = ? and shortCode = ?;`,
				serverId,
				identifier,
			);
			if (emoji) return Ok(emoji);
			return Err(DbErrorCode.NOT_FOUND);
		} catch (e) {
			return Err(DbErrorCode.UNKNOWN);
		}
	}
}

class Service {
	static find(server: KnownServer, identifier: string): DbResult<ServerEmoji> {
		return Repo.find(server.id, identifier);
	}

	static async upsertMany(
		db: SQLiteDatabase,
		server: KnownServer,
		items: any[],
	) {
		for await (const item of items) {
		}
	}
}

export { Repo as ServerEmojiRepo, Service as ServerEmojiService };
