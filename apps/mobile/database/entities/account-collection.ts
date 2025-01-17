import { DataSource } from '../dataSource';
import { RandomUtil } from '../../utils/random.utils';
import { Account, AccountCollection, AccountSavedPost } from '../_schema';

export enum ReservedCollection {
	DEFAULT = '__default__',
	LIKES = '__likes__',
	BOOKMARKS = '__bookmarks__',
}

export const reservedCollectionName: Record<ReservedCollection, string> = {
	[ReservedCollection.LIKES]: 'Likes',
	[ReservedCollection.BOOKMARKS]: 'Bookmarks',
	[ReservedCollection.DEFAULT]: 'Default',
};

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
		});
	}

	static removeCollection(db: DataSource, id: number): AccountCollection {
		db.accountCollection.updateById(id, {
			active: false,
		});

		return db.accountCollection.findOne({ id });
	}

	static listAll(db: DataSource) {
		return db.accountCollection.find({ active: true });
	}

	static listAllForAccount(db: DataSource, acct: Account) {
		return db.accountCollection.find({ active: true, accountId: acct.id });
	}

	/**
	 * add/remove a savedPost to a collection
	 * @param db
	 * @param collection
	 * @param savedPost
	 */
	static toggleLink(
		db: DataSource,
		collection: AccountCollection,
		savedPost: AccountSavedPost,
	) {
		if (!collection || !savedPost) return;
		const conflict = db.collectionSavedPost.findOne({
			// active: true,
			collectionId: collection.id,
			savedPostId: savedPost.id,
		});
		if (conflict) {
			db.collectionSavedPost.updateById(conflict.id, {
				active: !conflict.active,
			});
		} else {
			db.collectionSavedPost.insert({
				collectionId: collection.id,
				savedPostId: savedPost.id,
			});
		}

		return db.collectionSavedPost.findOne({
			active: true,
			collectionId: collection.id,
			savedPostId: savedPost.id,
		});
	}

	/**
	 * Make sure that the default collection is always
	 * available for an active account
	 * @param db
	 * @param acct
	 * @param identifier which reserved collection to upsert?
	 */
	static upsertReservedCollections(
		db: DataSource,
		acct: Account,
		identifier: ReservedCollection,
	) {
		const conflict = db.accountCollection.findOne({
			active: true,
			identifier: identifier,
			accountId: acct.id,
		});
		if (conflict) return;
		db.accountCollection.insert({
			uuid: RandomUtil.nanoId(),
			identifier: identifier,
			alias: reservedCollectionName[identifier],
			accountId: acct.id,
		});
	}
}

export { Repo as AccountCollectionRepo, Service as AccountCollectionService };
