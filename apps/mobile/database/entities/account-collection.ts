import { DataSource } from '../dataSource';
import { RandomUtil } from '../../utils/random.utils';
import { Account, AccountCollection } from '../_schema';

class Repo {}

class Service {
	static renameCollection(db: DataSource, id: number | string, name: string) {
		db.accountCollection.updateById(id, {
			alias: name,
		});
	}

	static addCollection(db: DataSource, acct: Account, name: string) {
		db.accountCollection.insert({
			uuid: RandomUtil.nanoId(),
			identifier: RandomUtil.nanoId(),
			alias: name,
			accountId: acct.id,
			itemOrder: 1,
			active: true,
		});
	}

	static removeCollection(db: DataSource, id: number): AccountCollection {
		db.accountCollection.updateById(id, {
			active: false,
		});

		return db.accountCollection.findOne({ id });
	}
}

export { Repo as AccountCollectionRepo, Service as AccountCollectionService };
