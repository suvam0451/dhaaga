import { AppPostObject } from '../../../types/app-post.types';
import { useDbSavedPostStatus } from '../api/useCollectionsQuery';
import { AccountCollection } from '../../../database/_schema';
import { useDbCollections } from '../api/useCollectionsMutation';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import useCollections from './useCollections';

/**
 * Helps add/remove a post to/from collections
 *
 * Also allows in-place creation of new collections
 * @param postId
 */
function useCollectionAssignmentInteractor(postId: string) {
	const queryResult = useDbSavedPostStatus(postId);
	const { togglePostToCollection } = useDbCollections();
	const { add } = useCollections();

	function toggleForCollection(
		postId: string,
		collection: AccountCollection,
		post?: AppPostObject,
	) {
		togglePostToCollection
			.mutateAsync({
				post: PostMiddleware.getContentTarget(post),
				collection,
			})
			.finally(() => {
				queryResult.refetch();
			})
			.catch((e) => {
				console.log(e);
			});
	}

	function addCollection(text: string) {
		add(text);
		queryResult.refetch();
	}

	return { ...queryResult, toggleForCollection, addCollection };
}

export default useCollectionAssignmentInteractor;
