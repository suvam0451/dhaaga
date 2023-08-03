import db from "./_core";

export function runMigrations() {
	db.transaction((tx) => {
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
        account_id INT NOT NULL,
        credential_type TEXT,
        credential_value TEXT,
        updated_at DATETIME
      );`);
	});
}
