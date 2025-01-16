import { RepoTemplate } from './_base.repo';
import { Account, AccountSavedUser } from '../_schema';
import { DataSource } from '../dataSource';
import { RandomUtil } from '../../utils/random.utils';
import { AppPostAuthorType } from '../../types/app-post.types';

class Repo implements RepoTemplate<AccountSavedUser> {}

class Service {
	static getByIdentifier(db: DataSource, identifier: string): AccountSavedUser {
		return db.accountSavedUser.findOne({
			identifier,
			active: true,
		});
	}
	static getById(db: DataSource, id: number): AccountSavedUser {
		return db.accountSavedUser.findOne({
			id,
			active: true,
		});
	}
	static upsert(db: DataSource, acct: Account, user: AppPostAuthorType) {
		const conflict = db.accountSavedUser.findOne({
			active: true,
			identifier: user.userId,
		});
		if (conflict) {
			db.accountSavedUser.updateById(conflict.id, {
				identifier: user.userId,
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
				identifier: user.userId,
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
			identifier: user.userId,
		});
	}
}

export { Repo as AccountSavedUserRepo, Service as AccountSavedUserService };
