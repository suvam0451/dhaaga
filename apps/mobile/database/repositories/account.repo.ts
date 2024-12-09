import * as SQLite from 'expo-sqlite';
import { APP_DB } from './_var';

export class AccountRepo {
	static async select(id: number) {
		const db = SQLite.openDatabaseSync(APP_DB);
		await Promise.all([
			db.runAsync('update account set selected = 1 where id = ?', id),
			db.runAsync('update account set selected = 0 where id <> ?', id),
		]);
	}

	static deselect(id: number) {
		const db = SQLite.openDatabaseSync(APP_DB);
		db.runSync('update account set selected = 0 where id = ?', id);
	}

	static remove(id: number) {
		const db = SQLite.openDatabaseSync(APP_DB);
		db.runSync(`delete from account where id = ?`, id);
	}
}
