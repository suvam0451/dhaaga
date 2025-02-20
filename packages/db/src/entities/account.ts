import { z } from 'zod';
import { Account } from '../_schema';
import { DbErrorHandler } from './_base.repo';
import {
	type AccountMetadataRecordType,
	AccountMetadataService,
} from './account-metadata';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { DataSource } from '../dataSource';
import { gt } from '@dhaaga/orm';
import { RandomUtil } from '@dhaaga/core';
import { ProfileService } from './profile';
import {
	AccountCollectionService,
	ReservedCollection,
} from './account-collection';
import { DbErrorCode, type DbResult, Err, Ok } from '../utils/db-result';

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
	static getById(db: DataSource, id: number | string): Account | null {
		try {
			return db.account.findOne({
				id: Number(id),
			});
		} catch (e) {
			return null;
		}
	}
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
	): DbResult<Account> {
		const match = Repo.getByHandleFragments(db, dto.server, dto.username);
		if (match) {
			ProfileService.setupDefaultProfile(db, match);
			return Ok(match);
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
			ProfileService.setupDefaultProfile(db, upserted!);
			return Ok(upserted!);
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
		ProfileService.deselectAll(db);
	}

	static updateSoftware(db: DataSource, id: number, driver: string) {
		db.account.update({ id }, { driver });
	}

	static getAll(db: DataSource): Account[] {
		return db.account.find();
	}

	static removeById(db: DataSource, id: number) {
		return db.db.runSync(`delete from account where id = ?`, id);
	}

	static getFirstSelected(db: DataSource): DbResult<Account> {
		const match = db.account.findOne({ selected: true });
		return match ? Ok(match) : Err(DbErrorCode.NOT_FOUND);
	}
}

class Service {
	static upsert(
		db: DataSource,
		acct: z.infer<typeof accountInsertDto>,
		metadata: AccountMetadataRecordType[],
	): DbResult<Account> {
		const upserted = Repo.upsert(db, acct);
		return upserted.tap((result) => {
			AccountMetadataService.upsertMultiple(db, result, metadata);
			ProfileService.setupDefaultProfile(db, result);
		});
	}

	static async selectSync(db: DataSource, acct: Account) {}

	static select(db: DataSource, acct: Account) {
		Repo.deselectAll(db);
		Repo.updateSelectionFlag(db, acct.id, true);
		ProfileService.selectDefaultProfile(db, acct);
	}

	static deselect(db: DataSource, acct: Account) {
		Repo.updateSelectionFlag(db, acct.id, false);
	}

	static getAll(db: DataSource) {
		return Repo.getAll(db);
	}

	static getAllWithProfiles(db: DataSource) {
		const accounts = Service.getAll(db);
		for (const account of accounts) {
			account.profiles = ProfileService.getForAccount(db, account);
		}
		return accounts;
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

	static getSelected(db: DataSource): DbResult<Account> {
		return Repo.getFirstSelected(db).tap((o) => {
			Service._postSelect(db, o);
		});
	}

	static getById(db: DataSource, id: number | string): Account | null {
		return Repo.getById(db, id);
	}

	/**
	 * Make sure at least one account is selected
	 */
	static ensureAccountSelection(db: DataSource) {
		try {
			const atLeastOne = db.account.find({ selected: true });
			if (atLeastOne.length === 0) {
				const match = db.account.findOne({ active: true });
				if (match) {
					db.account.updateById(match.id, {
						selected: true,
					});
				} else {
					console.log('[WARN]: no account to  default select');
				}
			}
		} catch (e) {
			console.log('[WARN]: failed to select default account', e);
		}
	}

	static _postSelect(db: DataSource, acct: Account) {
		// upsert timeline items
		AccountCollectionService.upsertReservedCollections(
			db,
			acct,
			ReservedCollection.DEFAULT,
		);
	}
}

export { Service as AccountService, Repo as AccountRepo };
