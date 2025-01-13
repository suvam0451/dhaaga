import { useQuery } from '@tanstack/react-query';
import {
	useAppAcct,
	useAppDb,
} from '../../hooks/utility/global-state-extractors';
import { AccountCollection, AccountSavedPost } from '../_schema';
import { AccountCollectionService } from '../entities/account-collection';
import { CollectionSavedPostService } from '../entities/collection-saved-post';
import { AccountSavedPostService } from '../entities/account-saved-post';

export function useDbListCollections() {
	const { db } = useAppDb();
	const { acct } = useAppAcct();

	return useQuery<AccountCollection[]>({
		queryKey: ['db', 'accountCollection', acct?.id],
		initialData: [],
		queryFn: () => {
			return AccountCollectionService.listAllForAccount(db, acct);
		},
	});
}

type CollectionHasSavedPost = AccountCollection & {
	has: boolean;
};

/**
 * Returns all collections for an account
 * and whether a given post has been saved in them
 *
 * i.e. - "has" param
 *
 * @param id identifier for the post,
 * right now, it is the server generated unique id
 */
export function useDbSavedPostStatus(id: string) {
	const { db } = useAppDb();
	const { acct } = useAppAcct();

	return useQuery<CollectionHasSavedPost[]>({
		queryKey: ['db', 'accountCollection', acct?.id, id],
		initialData: [],
		queryFn: () => {
			const saved = CollectionSavedPostService.findSavedPost(db, acct, id);
			const collections = AccountCollectionService.listAllForAccount(db, acct);
			const collectionIdsWithObject = new Set(
				saved.map((obj) => obj.collectionId),
			);
			for (let i = 0; i < collections.length; i++) {
				collections[i]['has'] = collectionIdsWithObject.has(collections[i].id);
			}
			return collections as CollectionHasSavedPost[];
		},
	});
}

export function useDbGetSavedPostsForCollection(id: number | string) {
	const { db } = useAppDb();

	return useQuery<AccountSavedPost[]>({
		queryKey: ['db', 'savedPosts', id],
		queryFn: () => {
			try {
				return AccountSavedPostService.listForCollectionId(
					db,
					parseInt(id as any),
				);
			} catch (e) {
				throw new Error(e);
			}
		},
		initialData: [],
	});
}
