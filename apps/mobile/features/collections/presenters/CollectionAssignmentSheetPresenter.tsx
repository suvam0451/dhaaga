import {
	useAppApiClient,
	useAppBottomSheet_Improved,
	useAppDialog,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { usePostInteractor } from '../../_pubsub/interactors/usePostInteractor';
import { View } from 'react-native';
import AssignmentSheetBookmarkView from '../views/AssignmentSheetBookmarkView';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import useCollectionAssignmentInteractor from '../interactors/useCollectionAssignmentInteractor';
import { AccountCollection } from '../../../database/_schema';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import BookmarkUnsupported from '../components/BookmarkUnsupported';
import CollectionItem from '../components/CollectionItem';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import CollectionSheetControlView from '../views/CollectionSheetControlView';
import { Fragment } from 'react';
import Animated from 'react-native-reanimated';

function CollectionAssignmentSheetPresenter() {
	const { driver } = useAppApiClient();
	const { ctx } = useAppBottomSheet_Improved();
	const { post, toggleBookmark } = usePostInteractor(ctx?.uuid);
	const { show } = useAppDialog();
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	const { data, toggleForCollection, addCollection } =
		useCollectionAssignmentInteractor(
			PostMiddleware.getContentTarget(post)?.id,
		);

	if (!post) return <View />;

	const _target = PostMiddleware.getContentTarget(post);
	const IS_BOOKMARKED = _target.interaction.bookmarked;

	function toggle(collection: AccountCollection) {
		toggleForCollection(post?.id, collection, post);
	}

	function onAddNewCollection() {
		show(
			{
				title: 'Add Collection',
				description: [
					'You can further manage collections from the profile (5th) tab.',
				],
				actions: [],
			},
			'Name your collection',
			(text: string) => {
				addCollection(text);
			},
		);
	}

	return (
		// required for touch inputs to work
		<View style={{ flex: 1 }}>
			<Animated.FlatList
				data={data}
				ListHeaderComponent={
					<Fragment>
						{driver === KNOWN_SOFTWARE.BLUESKY ? (
							<BookmarkUnsupported />
						) : (
							<AssignmentSheetBookmarkView
								bookmarked={IS_BOOKMARKED}
								toggleBookmark={toggleBookmark}
							/>
						)}
						<CollectionSheetControlView onPressAddNew={onAddNewCollection} />
					</Fragment>
				}
				renderItem={({ item }) => (
					<Animated.View style={{ paddingLeft: 16, paddingRight: 8 }}>
						<CollectionItem
							active={item.has}
							activeIconId={'checkmark-circle'}
							inactiveIconId={'add-circle-outline'}
							activeTint={theme.primary.a0}
							inactiveTint={theme.secondary.a30}
							label={item.alias}
							desc={
								t(`collections.features`, { returnObjects: true }) as string[]
							}
							onPress={() => {
								toggle(item);
							}}
						/>
					</Animated.View>
				)}
			/>
		</View>
	);
}

export default CollectionAssignmentSheetPresenter;
