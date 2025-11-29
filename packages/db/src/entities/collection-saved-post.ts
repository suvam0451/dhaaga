import { DataSource } from '../dataSource.js';
import { AccountSavedPostService } from './account-saved-post.js';
import { AccountCollectionService } from './account-collection.js';
import { Account } from '../_schema.js';

class Repo {}

class Service {
	static findSavedPost(db: DataSource, acct: Account, id: string) {
		const post = AccountSavedPostService.find(db, acct, id);
		if (!post) return [];

		const collections = AccountCollectionService.listAllForAccount(db, acct);
		const myCollectionIds = new Set(collections.map((obj) => obj.id));

		return db.collectionSavedPost
			.find({
				active: true,
				savedPostId: post.id,
			})
			.filter((o) => myCollectionIds.has(o.collectionId || -1));
	}
}

export {
	Repo as CollectionSavedPostRepo,
	Service as CollectionSavedPostService,
};
