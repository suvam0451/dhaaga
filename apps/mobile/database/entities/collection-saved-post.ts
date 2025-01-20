import { DataSource } from '../dataSource';
import { AccountSavedPostService } from './account-saved-post';
import { AccountCollectionService } from './account-collection';
import { Account } from '../_schema';

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
			.filter((o) => myCollectionIds.has(o.collectionId));
	}
}

export {
	Repo as CollectionSavedPostRepo,
	Service as CollectionSavedPostService,
};
