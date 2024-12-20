import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Account, Profile, ProfilePinnedUser } from '../_schema';
import { AccountRepo, AccountService } from './account';

@DbErrorHandler()
export class Repo {}

export class Service {
	static getOwnerAccount(db: DataSource, profile: Profile): Account {
		return AccountService.getById(db, profile.accountId);
	}

	static getShownForProfile(
		db: DataSource,
		profile: Profile,
	): ProfilePinnedUser[] {
		if (!db || !profile) return [];
		try {
			const items = db.profilePinnedUser.find({
				profileId: profile.id,
				active: true,
				show: true,
			});
			return items.sort((a, b) => (a.itemOrder > b.itemOrder ? 1 : -1));
		} catch (e) {
			return [];
		}
	}
}

export { Service as ProfilePinnedUserService, Repo as ProfilePinnedUserRepo };
