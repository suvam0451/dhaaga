import { useQuery } from '@tanstack/react-query';
import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import {
	AccountCollection,
	AccountSavedPost,
	AccountCollectionService,
	CollectionSavedPostService,
	AccountSavedPostService,
} from '@dhaaga/db';
import useCollections from './useCollections';
import { useState } from 'react';

export function useCollectionListInteractor() {
	const [IsLoading, setIsLoading] = useState(false);
	const { db } = useAppDb();
	const { acct } = useAppAcct();
	const { add, rename, describe, remove } = useCollections();

	const queryData = useQuery<AccountCollection[]>({
		queryKey: ['db', 'accountCollection', acct?.id],
		initialData: [],
		queryFn: () => {
			return AccountCollectionService.listAllForAccount(db, acct);
		},
	});

	async function _refetch() {
		setIsLoading(true);
		queryData.refetch().then(() => {
			setIsLoading(false);
		});
	}

	function onAdd(text: string) {
		add(text);
		_refetch();
	}

	function onRenamed(id: number, text: string) {
		rename(id, text);
		_refetch();
	}

	function onDescribe(id: number, text: string) {
		describe(id, text);
		_refetch();
	}

	function onRemove(id: number) {
		remove(id);
		_refetch();
	}

	return {
		...queryData,
		add: onAdd,
		loading: IsLoading,
		rename: onRenamed,
		describe: onDescribe,
		remove: onRemove,
	};
}

export type CollectionHasSavedPost = AccountCollection & {
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
		queryKey: ['db', 'collections/post-assign', acct?.id, id],
		initialData: [],
		queryFn: () => {
			const saved = CollectionSavedPostService.findSavedPost(db, acct, id);
			const st = new Set(saved.map((obj) => obj.collectionId));

			const collections = AccountCollectionService.listAllForAccount(db, acct);
			return collections.map((o) => ({ ...o, has: st.has(o.id) })) as any;
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
