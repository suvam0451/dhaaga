import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Account, Profile } from '../_schema';
import { AccountRepo, AccountService } from './account';

@DbErrorHandler()
export class Repo {}

export class Service {
	static getOwnerAccount(db: DataSource, profile: Profile): Account {
		return AccountService.getById(db, profile.accountId);
	}
}

export {
	Service as ProfilePinnedTimelineService,
	Repo as ProfilePinnedTimelineRepo,
};
