import * as SQLite from 'expo-sqlite';
import { APP_DB } from '../repositories/_var';
import { Result } from '../../utils/result';
import { ExpoSqliteColumnDefinition } from '../utils/db-typings';

type Migration = {
	id: number;
	userVersion: number; // unique
	versionCode: string;
	name: string;
};

const TABLE_NAME = 'migrations';

type SqlListOptions = {
	limit?: number;
	offset?: number;
};

export class MigrationRepo {
	static describe() {
		const db = SQLite.openDatabaseSync(APP_DB);
		const result = db.getAllSync<ExpoSqliteColumnDefinition>(
			`PRAGMA table_info(${TABLE_NAME});`,
		);

		console.log(result);
		console.log(result.map((o) => ({ name: o.name, type: o.type })));
	}

	static list(
		opts: SqlListOptions = { limit: 10, offset: 0 },
	): Result<Migration[]> {
		const db = SQLite.openDatabaseSync(APP_DB);
		try {
			const result = db.getAllSync<Migration>(
				`SELECT * FROM ${TABLE_NAME} ORDER BY userVersion DESC LIMIT ? OFFSET ?;`,
				opts.limit || 10,
				opts.offset || 0,
			);
			console.log(result);
			return { type: 'success', value: result };
		} catch (e) {
			console.log(e, e.message);
			return { type: 'error', error: e };
		}
	}
}
