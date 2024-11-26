import * as SQLite from 'expo-sqlite';
import { APP_DB } from './_var';

export class DbMetaRepo {
	static listTables() {
		const db = SQLite.openDatabaseSync(APP_DB);
		const res = db.getAllSync(`
			SELECT name 
			FROM sqlite_master 
			WHERE type = 'table' 
			ORDER BY name;
		`);
		console.log(res);
	}

	static async getDbVersion() {}
}
