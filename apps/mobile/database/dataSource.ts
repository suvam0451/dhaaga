import { Account, AccountMetadata } from './_schema';
import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Implementation inspired from TypeORM ^v0.3
 */
export class DataSource {
	db: SQLiteDatabase;
	account: Account;
	accountMetadata: AccountMetadata;

	constructor(db: SQLiteDatabase) {
		this.db = db;
		this.account = new Account(db);
		this.accountMetadata = new AccountMetadata(db);
	}
}
