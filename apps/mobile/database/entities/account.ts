import { z } from 'zod';
import { Account } from '../_schema';
import { DbErrorHandler } from './_base.repo';
import { SQLiteDatabase } from 'expo-sqlite';
import { Result, withSuccess } from '../../utils/result';
import {
	AccountMetadataRecordType,
	AccountMetadataService,
} from './account-metadata';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';

/**
 * --- Validators
 */

export const accountInsertDto = z.object({
	identifier: z.string(),
	driver: z.string(),
	server: z.string(),
	username: z.string(),
	avatarUrl: z.ostring().nullable(),
	displayName: z.ostring().nullable(),
});

// export type AppProfile = {
// 	id: number;
// 	name: string;
// 	selected: boolean;
// 	createdAt: Date;
// 	updatedAt: Date;
// };

/**
 * ---
 */

@DbErrorHandler()
export class Repo {
	static async getByHandleFragments(
		db: SQLiteDatabase,
		server: string,
		username: string,
	): Promise<Result<Account>> {
		const match = await db.getFirstAsync<Account>(
			`select * from account where server = ? and username = ?`,
			server,
			username,
		);
		return withSuccess(match);
	}

	static async upsert(
		db: SQLiteDatabase,
		dto: z.infer<typeof accountInsertDto>,
	) {
		const match = await Repo.getByHandleFragments(db, dto.server, dto.username);
		if (match) {
			// update operation
		} else {
			db.runSync(
				`
				insert into account (identifier, driver, server, username, displayName, avatarUrl)
				values (?, ?, ?, ?, ?, ?)
			`,
				dto.identifier,
				dto.driver,
				dto.server,
				dto.username,
				dto.displayName,
				dto.avatarUrl,
			);
		}
		return await Repo.getByHandleFragments(db, dto.server, dto.username);
	}

	static async updateSelectionFlag(
		db: SQLiteDatabase,
		id: number,
		flag: boolean,
	) {
		await db.runAsync(
			`update account set selected = ? where id = ?;`,
			flag,
			id,
		);
	}

	static async deselectAll(db: SQLiteDatabase) {
		await db.runAsync(`update account set selected = false where id > 0;`);
	}

	static async updateSoftware(db: SQLiteDatabase, id: number, driver: string) {
		return await db.runAsync(
			`update account set driver = ? where id = ?`,
			driver,
			id,
		);
	}

	static async getAll(db: SQLiteDatabase): Promise<Result<Account[]>> {
		const rows = await db.getAllAsync<Account>(`select * from account;`);
		return withSuccess(rows);
	}

	static async remove(db: SQLiteDatabase, id: number) {
		return db.runAsync(`delete from account where id = ?`, id);
	}

	static async getFirstSelected(db: SQLiteDatabase) {
		return await db.getFirstAsync<Account>(
			`select * from account where selected = 1;`,
		);
	}
}

class Service {
	static async upsert(
		db: SQLiteDatabase,
		acct: z.infer<typeof accountInsertDto>,
		metadata: AccountMetadataRecordType[],
	): Promise<Result<Account>> {
		const upsertResult = await Repo.upsert(db, acct);
		if (upsertResult.type === 'success') {
			await AccountMetadataService.upsertMultiple(
				db,
				upsertResult.value,
				metadata,
			);
			return withSuccess(upsertResult.value);
		}
	}

	static async select(db: SQLiteDatabase, acct: Account) {
		await Repo.deselectAll(db);
		await Repo.updateSelectionFlag(db, acct.id, true);
	}

	static async deselect(db: SQLiteDatabase, acct: Account) {
		await Repo.updateSelectionFlag(db, acct.id, false);
	}

	static async getAll(db: SQLiteDatabase) {
		return Repo.getAll(db);
	}

	static async remove(db: SQLiteDatabase, acct: Account) {
		return Repo.remove(db, acct.id);
	}

	static async removeById(db: SQLiteDatabase, id: number) {
		return Repo.remove(db, id);
	}

	static async updateDriver(
		db: SQLiteDatabase,
		acct: Account,
		driver: KNOWN_SOFTWARE | string,
	) {
		return Repo.updateSoftware(db, acct.id, driver.toString());
	}

	static async getSelected(db: SQLiteDatabase): Promise<Account | null> {
		try {
			return Repo.getFirstSelected(db);
		} catch (e) {
			return null;
		}
	}
}

export { Service as AccountService, Repo as AccountRepo };
