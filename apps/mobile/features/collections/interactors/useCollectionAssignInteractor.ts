import { useDbSavedPostStatus } from '../api/useCollectionsQuery';
import { AccountCollection } from '@dhaaga/db';
import useCollections from '../api/useCollections';
import { useState } from 'react';
import { PostInspector } from '@dhaaga/core';
import type { PostObjectType } from '@dhaaga/core';

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

	function onToggle(collection: AccountCollection, post: PostObjectType) {
		toggleForCollection(collection, PostInspector.getContentTarget(post));
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
