import {
	useAppApiClient,
	useAppBottomSheet_Improved,
	useAppDialog,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { usePostInteractor } from '../../_pubsub/interactors/usePostInteractor';
import { FlatList, View } from 'react-native';
import AssignmentSheetBookmarkView from '../views/AssignmentSheetBookmarkView';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import useCollectionAssignInteractor from '../interactors/useCollectionAssignInteractor';
import { AccountCollection } from '../../../database/_schema';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import BookmarkUnsupported from '../components/BookmarkUnsupported';
import CollectionItem from '../components/CollectionItem';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import CollectionSheetControlView from '../views/CollectionSheetControlView';
import { Fragment } from 'react';
import { AppText } from '../../../components/lib/Text';
import { appDimensions } from '../../../styles/dimensions';

function CollectionAssignmentSheetPresenter() {
	const { driver } = useAppApiClient();
	const { ctx } = useAppBottomSheet_Improved();
	const { post, toggleBookmark } = usePostInteractor(ctx?.uuid);
	const { show } = useAppDialog();
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	const { data, toggle, add } = useCollectionAssignInteractor(
		PostMiddleware.getContentTarget(post)?.id,
	);

	if (!post) return <View />;

	const _target = PostMiddleware.getContentTarget(post);
	const IS_BOOKMARKED = _target.interaction.bookmarked;

	function onToggle(collection: AccountCollection) {
		toggle(collection, post);
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
				add(text);
			},
		);
	}

	return (
		// required for touch inputs to work
		<View style={{ flex: 1 }}>
			<FlatList
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
					<View style={{ paddingLeft: 16, paddingRight: 8 }}>
						<CollectionItem
							active={item.has}
							activeIconId={'checkmark-circle'}
							inactiveIconId={'add-circle-outline'}
							activeTint={theme.primary.a0}
							inactiveTint={theme.secondary.a30}
							label={item.alias}
							desc={item.desc || t(`collections.fallbackDesc`)}
							onPress={() => {
								onToggle(item);
							}}
						/>
					</View>
				)}
				ListFooterComponent={
					<View>
						<AppText.Medium
							style={{
								color: theme.complementary.a0,
								textAlign: 'center',
								marginTop: appDimensions.timelines.sectionBottomMargin,
							}}
						>
							{t(`collections.disclaimer`)}
						</AppText.Medium>
					</View>
				}
				contentContainerStyle={{
					paddingBottom: appDimensions.timelines.sectionBottomMargin * 4,
				}}
			/>
		</View>
	);
}

export default CollectionAssignmentSheetPresenter;
