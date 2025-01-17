import { useAppBottomSheet_Improved } from '../../../hooks/utility/global-state-extractors';
import { usePostInteractor } from '../../_pubsub/interactors/usePostInteractor';
import { ScrollView, StyleSheet, View } from 'react-native';
import AssignmentSheetBookmarkView from '../views/AssignmentSheetBookmarkView';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import AssignmentSheetCollectionView from '../views/AssignmentSheetCollectionView';
import useCollectionAssignmentInteractor from '../interactors/useCollectionAssignmentInteractor';
import { AccountCollection } from '../../../database/_schema';

function CollectionAssignmentSheetPresenter() {
	const { ctx } = useAppBottomSheet_Improved();
	const { post, toggleBookmark } = usePostInteractor(ctx?.uuid);
	const { data, toggleForCollection } = useCollectionAssignmentInteractor(
		post?.uuid,
	);

	if (!post) return <View />;

	const _target = PostMiddleware.getContentTarget(post);
	const IS_BOOKMARKED = _target.interaction.bookmarked;

	function toggle(collection: AccountCollection) {
		toggleForCollection(post?.id, collection, post);
	}
	return (
		<ScrollView
			style={styles.root}
			contentContainerStyle={{
				paddingTop: 32,
				paddingBottom: 48,
			}}
		>
			<View style={{ backgroundColor: 'red', height: 200, width: 100 }}></View>
			<AssignmentSheetBookmarkView
				bookmarked={IS_BOOKMARKED}
				toggleBookmark={toggleBookmark}
			/>
			<AssignmentSheetCollectionView items={data} toggle={toggle} />
		</ScrollView>
	);
}

export default CollectionAssignmentSheetPresenter;

const styles = StyleSheet.create({
	root: {
		paddingHorizontal: 16,
		flex: 1,
		marginTop: 12,
	},
});
