import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Account } from '../_schema';
import { eq, gt } from '@dhaaga/orm';

@DbErrorHandler()
class Repo {}

class Service {
	static deselectAll(db: DataSource) {
		db.accountProfile.update({ id: gt(0) as any }, { selected: false });
	}

	static getDefaultProfile(db: DataSource, acct: Account) {
		return db.accountProfile.findOne({
			accountId: acct.id,
			uuid: 'DEFAULT',
		});
	}

	static getActiveProfile(db: DataSource, acct: Account) {
		const found = db.accountProfile.findOne({
			accountId: acct.id,
			selected: true,
		});
		if (!found) return Service.getDefaultProfile(db, acct);
		return found;
	}

	static setupDefaultProfile(db: DataSource, acct: Account) {
		const conflict = Service.getDefaultProfile(db, acct);
		if (!conflict) {
			db.accountProfile.insert({
				accountId: acct.id,
				uuid: 'DEFAULT',
				name: 'Default',
				selected: true, // selected by default
			});
		}
	}

	static selectDefaultProfile(db: DataSource, acct: Account) {
		const conflict = Service.getDefaultProfile(db, acct);
		db.accountProfile.update(
			{ id: eq(conflict.id) as any },
			{ selected: true },
		);
	}
}

export { Repo as AccountProfileRepo, Service as AccountProfileService };
