import { useActiveUserSession, useAppDb } from '../../../states/global/hooks';
import {
	AccountCollectionService,
	AccountCollection,
	AccountSavedPostService,
} from '@dhaaga/db';
import type { PostObjectType } from '@dhaaga/bridge';

/**
 * Perform operations on the
 * collection records
 */
function useCollections() {
	const { acct } = useActiveUserSession();
	const { db } = useAppDb();

	function add(text: string) {
		if (!text) return;

		AccountCollectionService.addCollection(db, acct, text);
	}

	function rename(id: number, text: string) {
		AccountCollectionService.renameCollection(db, id, text);
	}

	function describe(id: number, text: string) {
		AccountCollectionService.describeCollection(db, id, text);
	}

	function remove(id: number) {
		AccountCollectionService.removeCollection(db, id);
	}

	function toggleForCollection(
		collection: AccountCollection,
		post: PostObjectType,
	) {
		const savedPost = AccountSavedPostService.upsert(db, acct, post);
		AccountCollectionService.toggleLink(db, collection, savedPost);
	}

	return { add, rename, describe, remove, toggleForCollection };
}

export default useCollections;
