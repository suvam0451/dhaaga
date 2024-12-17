import { z } from 'zod';
import { Account } from '../_schema';
import { DbErrorHandler } from './_base.repo';
import { Result, withSuccess } from '../../utils/result';
import {
	AccountMetadataRecordType,
	AccountMetadataService,
} from './account-metadata';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { DataSource } from '../dataSource';
import { gt } from '@dhaaga/orm';
import { RandomUtil } from '../../utils/random.utils';
import { AccountProfileService } from './profile';

/**
 * --- Validators
 */
export const accountInsertDto = z.object({
	uuid: z.string(),
	identifier: z.string(),
	driver: z.string(),
	server: z.string(),
	username: z.string(),
	avatarUrl: z.string().nullable(),
	displayName: z.string().nullable(),
});

@DbErrorHandler()
export class Repo {
	static getByHandleFragments(
		db: DataSource,
		server: string,
		username: string,
	): Account | null {
		try {
			return db.account.findOne({
				server,
				username,
			});
		} catch (e) {
			return null;
		}
	}

	static upsert(
		db: DataSource,
		dto: z.infer<typeof accountInsertDto>,
	): Result<Account> {
		const match = Repo.getByHandleFragments(db, dto.server, dto.username);
		if (match) {
			return withSuccess(match);
		} else {
			db.account.insert({
				uuid: RandomUtil.nanoId(),
				identifier: dto.identifier,
				driver: dto.driver,
				server: dto.server,
				username: dto.username,
				displayName: dto.displayName,
				avatarUrl: dto.avatarUrl,
			});
			const upserted = Repo.getByHandleFragments(db, dto.server, dto.username);
			AccountProfileService.setupDefaultProfile(db, upserted);
			return withSuccess(upserted);
		}
	}

	static updateSelectionFlag(db: DataSource, id: number, flag: boolean) {
		db.account.update({ id }, { selected: flag });
	}

	static deselectAll(db: DataSource) {
		db.account.update(
			{ id: gt(0) as any },
			{
				selected: false,
			},
		);
		AccountProfileService.deselectAll(db);
	}

	static updateSoftware(db: DataSource, id: number, driver: string) {
		db.account.update({ id }, { driver });
	}

	static getAll(db: DataSource): Result<Account[]> {
		const rows = db.account.find();
		return withSuccess(rows);
	}

	static removeById(db: DataSource, id: number) {
		return db.db.runAsync(`delete from account where id = ?`, id);
	}

	static getFirstSelected(db: DataSource) {
		return db.account.findOne({ selected: true });
	}
}

class Service {
	static upsert(
		db: DataSource,
		acct: z.infer<typeof accountInsertDto>,
		metadata: AccountMetadataRecordType[],
	): Result<Account> {
		const upsertResult = Repo.upsert(db, acct);
		if (upsertResult.type === 'success') {
			AccountMetadataService.upsertMultiple(db, upsertResult.value, metadata);
			return withSuccess(upsertResult.value);
		}
	}

	static async selectSync(db: DataSource, acct: Account) {}

	static select(db: DataSource, acct: Account) {
		Repo.deselectAll(db);
		Repo.updateSelectionFlag(db, acct.id, true);
		AccountProfileService.selectDefaultProfile(db, acct);
	}

	static deselect(db: DataSource, acct: Account) {
		Repo.updateSelectionFlag(db, acct.id, false);
	}

	static getAll(db: DataSource) {
		return Repo.getAll(db);
	}

	static remove(db: DataSource, acct: Account) {
		return Repo.removeById(db, acct.id);
	}

	static removeById(db: DataSource, id: number) {
		return Repo.removeById(db, id);
	}

	static updateDriver(
		db: DataSource,
		acct: Account,
		driver: KNOWN_SOFTWARE | string,
	) {
		return Repo.updateSoftware(db, acct.id, driver.toString());
	}

	static getSelected(db: DataSource): Account | null {
		try {
			return Repo.getFirstSelected(db);
		} catch (e) {
			return null;
		}
	}
}

export { Service as AccountService, Repo as AccountRepo };
