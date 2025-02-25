import * as SQLite from 'expo-sqlite';
import { KnownServer, ServerEmoji } from '../_schema';
import { Result } from '../../utils/result';
import { SQLiteDatabase } from 'expo-sqlite';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/bridge';
import { APP_DB } from '../../types/db.types';

export class Repo {
	/**
	 * @param serverId fk
	 * @param identifier shortCode/alias of the reaction
	 */
	static find(serverId: number, identifier: string): Result<ServerEmoji> {
		const db = SQLite.openDatabaseSync(APP_DB);

		try {
			const emoji = db.getFirstSync<ServerEmoji>(
				`select * from serverEmoji where serverId = ? and shortCode = ?;`,
				serverId,
				identifier,
			);
			if (emoji) return { type: 'success', value: emoji };
			return { type: 'not-found' };
		} catch (e) {
			return { type: 'error', error: e };
		}
	}
}

class Service {
	static find(server: KnownServer, identifier: string): Result<ServerEmoji> {
		return Repo.find(server.id, identifier);
	}

	static async upsertMany(
		db: SQLiteDatabase,
		server: KnownServer,
		items: InstanceApi_CustomEmojiDTO[],
	) {
		for await (const item of items) {
		}
	}
}

export { Repo as ServerEmojiRepo, Service as ServerEmojiService };
