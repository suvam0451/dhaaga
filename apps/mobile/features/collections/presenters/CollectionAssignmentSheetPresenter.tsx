import {
	useAppApiClient,
	useAppBottomSheet_Improved,
} from '../../../hooks/utility/global-state-extractors';
import { usePostInteractor } from '../../_pubsub/interactors/usePostInteractor';
import { ScrollView, View } from 'react-native';
import AssignmentSheetBookmarkView from '../views/AssignmentSheetBookmarkView';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import AssignmentSheetCollectionView from '../views/AssignmentSheetCollectionView';
import useCollectionAssignmentInteractor from '../interactors/useCollectionAssignmentInteractor';
import { AccountCollection } from '../../../database/_schema';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import BookmarkUnsupported from '../components/BookmarkUnsupported';

function CollectionAssignmentSheetPresenter() {
	const { driver } = useAppApiClient();
	const { ctx } = useAppBottomSheet_Improved();
	const { post, toggleBookmark } = usePostInteractor(ctx?.uuid);
	const { data, toggleForCollection } = useCollectionAssignmentInteractor(
		post?.id,
	);

	if (!post) return <View />;

	const _target = PostMiddleware.getContentTarget(post);
	const IS_BOOKMARKED = _target.interaction.bookmarked;

	function toggle(collection: AccountCollection) {
		console.log(post?.id, collection);
		toggleForCollection(post?.id, collection, post);
	}
	return (
		<ScrollView>
			{driver === KNOWN_SOFTWARE.BLUESKY ? (
				<BookmarkUnsupported />
			) : (
				<AssignmentSheetBookmarkView
					bookmarked={IS_BOOKMARKED}
					toggleBookmark={toggleBookmark}
				/>
			)}
			<AssignmentSheetCollectionView items={data} toggle={toggle} />
		</ScrollView>
	);
}

export default CollectionAssignmentSheetPresenter;
