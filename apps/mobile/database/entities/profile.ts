import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Account, Profile } from '../_schema';
import { eq, gt } from '@dhaaga/orm';
import { AccountService } from './account';
import { ProfilePinnedTimelineService } from './profile-pinned-timeline';
import { ProfilePinnedTagService } from './profile-pinned-tag';

@DbErrorHandler()
class Repo {}

class Service {
	static getShownProfiles(db: DataSource) {
		return db.profile.find({ active: true });
	}
	static getForAccount(db: DataSource, acct: Account) {
		return db.profile.find({ active: true, accountId: acct.id });
	}

	static deselectAll(db: DataSource) {
		db.profile.update({ id: gt(0) as any }, { selected: false });
	}

	static getDefaultProfile(db: DataSource, acct: Account) {
		const match = db.profile.findOne({
			accountId: acct.id,
			uuid: 'DEFAULT',
		});
		if (match) {
			Service._postSelect(db, match);
			return match;
		}
		return null;
	}

	static getActiveProfile(db: DataSource, acct: Account) {
		const found = db.profile.findOne({
			accountId: acct.id,
			selected: true,
		});
		if (!found) return Service.getDefaultProfile(db, acct);

		Service._postSelect(db, found);
		return found;
	}

	/**
	 * Makes sure the default profile is always populated
	 * @param db
	 * @param acct
	 */
	static setupDefaultProfile(db: DataSource, acct: Account) {
		let conflict = Service.getDefaultProfile(db, acct);
		if (!conflict) {
			db.profile.insert({
				accountId: acct.id,
				uuid: 'DEFAULT',
				name: 'Default',
				selected: true, // selected by default
			});
		}

		conflict = Service.getDefaultProfile(db, acct);

		Service._postInsert(db, conflict);
	}

	static selectDefaultProfile(db: DataSource, acct: Account) {
		const conflict = Service.getDefaultProfile(db, acct);
		db.profile.update({ id: eq(conflict.id) as any }, { selected: true });
	}

	static getOwnerAccount(db: DataSource, profile: Profile): Account {
		return AccountService.getById(db, profile.accountId);
	}

	/**
	 * Lifecycle Hooks
	 * @param db
	 * @param profile
	 */
	static _postInsert(db: DataSource, profile: Profile) {
		// upsert timeline items
		ProfilePinnedTimelineService.upsertDefaultTimelines(db, profile);
		ProfilePinnedTagService.upsertDefaultTags(db, profile);
	}

	static _postSelect(db: DataSource, profile: Profile) {
		// upsert timeline items
		ProfilePinnedTimelineService.upsertDefaultTimelines(db, profile);
		ProfilePinnedTagService.upsertDefaultTags(db, profile);
	}
}

export { Repo as ProfileRepo, Service as ProfileService };
