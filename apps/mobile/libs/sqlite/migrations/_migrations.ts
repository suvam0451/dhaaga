import coreDb from "../connections/core";
import activitypubDb from "../connections/activity_pub";

export function runCoreMigrations() {
	coreDb.transaction(
		(tx) => {
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        domain TEXT,
        subdomain TEXT,
        username TEXT,
        password TEXT,
        last_login_at DATETIME,
        verified INT DEFAULT 0
      );`
			);
			tx.executeSql(`
      CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        credential_type TEXT,
        credential_value TEXT,
        updated_at DATETIME,
        account_id INTEGER,
        FOREIGN KEY (account_id) REFERENCES accounts (id)
      );`);
		},
		(e) => {
			console.log("core db migration error", e);
		},
		() => {
			console.log("core db migration success");
		}
	);
}

export function runActivityPubMigrations() {
	activitypubDb.transaction(
		(tx) => {
			tx.executeSql(`
      CREATE TABLE IF NOT EXISTS instance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        url TEXT,
        blocked INT DEFAULT 0,
        favourited INT DEFAULT 0);
      `);
			tx.executeSql(`
      CREATE TABLE IF NOT EXISTS emoji (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        url TEXT,
        favourited INT DEFAULT 0,
        instance_id INTEGER,
        FOREIGN KEY (instance_id) REFERENCES instance (id)) ON DELETE CASCADE;
   `);
			tx.executeSql(`
      CREATE TABLE IF NOT EXISTS emoji_alias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alias TEXT,
        emoji_id INTEGER,
        FOREIGN KEY (emoji_id) REFERENCES emoji (id)) ON DELETE CASCADE;
   `);
		},
		(e) => {
			console.log("activitypub db migration error", e);
		},
		() => {
			console.log("activitypub db migration success");
		}
	);
}
