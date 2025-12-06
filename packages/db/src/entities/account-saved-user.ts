import { RepoTemplate } from './_base.repo.js';
import { Account, AccountSavedUser } from '../_schema.js';
import { DataSource } from '../dataSource.js';
import { RandomUtil } from '@dhaaga/bridge';
import type { PostAuthorType } from '@dhaaga/bridge/typings';

class Repo implements RepoTemplate<AccountSavedUser> {}

class Service {
	static getByIdentifier(
		db: DataSource,
		identifier: string,
	): AccountSavedUser | null {
		return db.accountSavedUser.findOne({
			identifier,
			active: true,
		});
	}
	static getById(db: DataSource, id: number): AccountSavedUser | null {
		return db.accountSavedUser.findOne({
			id,
			active: true,
		});
	}
	static upsert(db: DataSource, acct: Account, user: PostAuthorType) {
		const conflict = db.accountSavedUser.findOne({
			active: true,
			identifier: user.id,
		});
		if (conflict) {
			db.accountSavedUser.updateById(conflict.id, {
				identifier: user.id,
				remoteServer: user.instance,
				avatarUrl: user.avatarUrl,
				displayName: user.displayName,
				username: user.handle,
				accountId: acct.id,
				isRemote: false,
				active: true,
			});
		} else {
			db.accountSavedUser.insert({
				uuid: RandomUtil.nanoId(),
				identifier: user.id,
				remoteServer: user.instance,
				avatarUrl: user.avatarUrl,
				displayName: user.displayName,
				username: user.handle,
				accountId: acct.id,
				isRemote: false,
				active: true,
			});
		}

		return db.accountSavedUser.findOne({
			identifier: user.id,
		});
	}
}

export { Repo as AccountSavedUserRepo, Service as AccountSavedUserService };
