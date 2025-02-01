import { AppPostObject } from '../../../types/app-post.types';
import { useDbSavedPostStatus } from '../api/useCollectionsQuery';
import { AccountCollection } from '../../../database/_schema';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import useCollections from '../api/useCollections';
import { useState } from 'react';

/**
 * Helps add/remove a post to/from collections
 *
 * Also allows in-place creation of new collections
 * @param postId
 */
function useCollectionAssignInteractor(postId: string) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const queryResult = useDbSavedPostStatus(postId);
	const { add, toggleForCollection } = useCollections();

	async function _refetch() {
		setIsRefreshing(true);
		queryResult.refetch().finally(() => setIsRefreshing(false));
	}

	function onToggle(collection: AccountCollection, post: AppPostObject) {
		toggleForCollection(collection, PostMiddleware.getContentTarget(post));
		_refetch();
	}

	function onAdd(text: string) {
		add(text);
		_refetch();
	}

	return {
		...queryResult,
		toggle: onToggle,
		add: onAdd,
		loading: IsRefreshing,
	};
}

export default useCollectionAssignInteractor;
