import * as SQLite from 'expo-sqlite';
import { APP_DB } from '../repositories/_var';
import { Server, ServerEmoji, ServerEmojiAlias } from '../_schema';
import { Result } from '../../utils/result';

export class ServerEmojiRepo {
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

export class ServerEmojiService {
	static find(server: Server, identifier: string): Result<ServerEmoji> {
		return ServerEmojiRepo.find(server.id, identifier);
	}
}
