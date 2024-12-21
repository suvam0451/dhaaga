import * as SQLite from 'expo-sqlite';
import { APP_DB } from '../repositories/_var';
import { Result } from '../../utils/result';
import { z } from 'zod';
import { ExpoSqliteColumnDefinition } from '../utils/db-typings';
import { DbErrorHandler, RepoTemplate } from './_base.repo';
import { Account, AccountMetadata } from '../_schema';
import { DataSource } from '../dataSource';

export type AccountMetadataRecordType = {
	key: string;
	value: string;
	type: 'string' | 'integer' | 'json';
};
export const accountMetadataRecordDto = z.object({
	key: z.string(),
	value: z.string(),
	type: z.string(),
});

export type AppAtpSessionData = {
	accessJwt: string;
	refreshJwt: string;
	handle: string;
	did: string;
};

export const accountMetadataUpsertDto = accountMetadataRecordDto.extend({
	accountId: z.onumber(),
});

/**
 * List of recognised account metadata
 *
 */
export enum ACCOUNT_METADATA_KEY {
	USER_IDENTIFIER = 'userIdentifier',
	AVATAR_URL = 'avatarUrl',
	DISPLAY_NAME = 'displayName',
	ACCESS_TOKEN = 'accessToken',
	REFRESH_TOKEN = 'refreshToken',
	ATPROTO_SESSION_OBJECT = 'atprotoSessionObject',
}

@DbErrorHandler()
class Repo implements RepoTemplate<AccountMetadata> {
	static getAllKeysForAccount(db: DataSource, accountId: number) {
		return db.accountMetadata.find({
			accountId,
			active: true,
		});
	}
	static getByAccountAndKeySync(
		db: DataSource,
		acctId: number,
		key: string,
	): AccountMetadata {
		try {
			return db.accountMetadata.findOne({
				accountId: acctId,
				key,
			});
		} catch (e) {
			console.log('[WARN]: failed to get account metadata', e);
			return null;
		}
	}

	static describe() {
		const db = SQLite.openDatabaseSync(APP_DB);
		const result = db.getAllSync<ExpoSqliteColumnDefinition>(
			`PRAGMA table_info(accountMetadata);`,
		);
		console.log(result);
		console.log(result.map((o) => ({ name: o.name, type: o.type })));
	}

	static listForAccount(acct: Account): Result<AccountMetadata[]> {
		const db = SQLite.openDatabaseSync(APP_DB);
		try {
			const res = db.getAllSync<AccountMetadata>(
				`select * from accountMetadata where accountId = ?`,
				acct.id,
			);
			return { type: 'success', value: res };
		} catch (e) {
			console.log(e, e.message);
			return { type: 'error', error: e };
		}
	}

	static upsert(
		db: DataSource,
		dto: z.infer<typeof accountMetadataUpsertDto>,
	): Result<undefined> {
		const where = {
			accountId: dto.accountId,
			key: dto.key,
		};

		try {
			const duplicate = db.accountMetadata.findOne(where);
			if (duplicate) {
				db.accountMetadata.update(where, {
					value: duplicate.value,
					type: duplicate.type,
				});
			} else {
				db.accountMetadata.insert({
					key: dto.key,
					value: dto.value,
					type: dto.type,
					accountId: dto.accountId,
				});
			}
			return { type: 'success', value: undefined };
		} catch (e) {
			console.log(e, e.message);
			return { type: 'error', error: e };
		}
	}

	static upsertMultiple(
		db: DataSource,
		inputs: z.infer<typeof accountMetadataUpsertDto>[],
	) {
		for (const input of inputs) {
			Repo.upsert(db, input);
		}
	}
}

class Service {
	static upsertMultiple(
		db: DataSource,
		acct: Account,
		metadata: AccountMetadataRecordType[],
	) {
		Repo.upsertMultiple(
			db,
			metadata.map((o) => ({ ...o, accountId: acct.id })),
		);
	}

	static upsert(
		db: DataSource,
		acct: Account,
		input: AccountMetadataRecordType,
	) {
		return Repo.upsert(db, { ...input, accountId: acct.id });
	}

	static async getAtpSessionData(db: DataSource, acct: Account) {
		try {
			const accessJwt = Repo.getByAccountAndKeySync(
				db,
				acct.id,
				'accessToken',
			)?.value;
			const refreshJwt = Repo.getByAccountAndKeySync(
				db,
				acct.id,
				'refreshToken',
			)?.value;
			const did = Repo.getByAccountAndKeySync(db, acct.id, 'did')?.value;

			if (!accessJwt || !refreshJwt || !did) {
				console.log('[ERROR]: atproto session data unavailable in db');
				return null;
			}

			return {
				accessJwt,
				refreshJwt,
				handle: acct.username,
				did,
			};
		} catch (e) {
			console.log('[ERROR]: reconstructing cached atp data', e);
			return null;
		}
	}

	static getKeyValueForAccountSync(db: DataSource, acct: Account, key: string) {
		return Repo.getByAccountAndKeySync(db, acct.id, key)?.value;
	}

	static getAllKeysForAccount(db: DataSource, acct: Account) {
		return Repo.getAllKeysForAccount(db, acct.id);
	}
}

export { Repo as AccountMetadataRepo, Service as AccountMetadataService };
