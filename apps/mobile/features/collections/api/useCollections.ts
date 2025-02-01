import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import {
	AccountCollectionService,
	AccountCollectionService as Service,
} from '../../../database/entities/account-collection';
import { AppPostObject } from '../../../types/app-post.types';
import { AccountCollection } from '../../../database/_schema';
import { AccountSavedPostService } from '../../../database/entities/account-saved-post';

/**
 * Perform operations on the
 * collection records
 */
function useCollections() {
	const { acct } = useAppAcct();
	const { db } = useAppDb();

	function add(text: string) {
		if (!text) return;

		Service.addCollection(db, acct, text);
	}

	function rename(id: number, text: string) {
		Service.renameCollection(db, id, text);
	}

	function describe(id: number, text: string) {
		Service.describeCollection(db, id, text);
	}

	function remove(id: number) {
		Service.removeCollection(db, id);
	}

	function toggleForCollection(
		collection: AccountCollection,
		post: AppPostObject,
	) {
		const savedPost = AccountSavedPostService.upsert(db, acct, post);
		AccountCollectionService.toggleLink(db, collection, savedPost);
	}

	return { add, rename, describe, remove, toggleForCollection };
}

export default useCollections;
