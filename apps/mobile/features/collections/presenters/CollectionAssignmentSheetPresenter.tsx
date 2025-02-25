import {
	useAppApiClient,
	useAppBottomSheet,
	useAppDialog,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { usePostInteractor } from '../../_pubsub/interactors/usePostInteractor';
import { FlatList, View } from 'react-native';
import AssignmentSheetBookmarkView from '../views/AssignmentSheetBookmarkView';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';
import useCollectionAssignInteractor from '../interactors/useCollectionAssignInteractor';
import { AccountCollection } from '@dhaaga/db';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import BookmarkUnsupported from '../components/BookmarkUnsupported';
import CollectionItem from '../components/CollectionItem';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import AssignmentListControlView from '../../_shared/views/AssignmentListControlView';
import { Fragment } from 'react';
import { AppText } from '../../../components/lib/Text';
import { appDimensions } from '../../../styles/dimensions';

function CollectionAssignmentSheetPresenter() {
	const { driver } = useAppApiClient();
	const { ctx } = useAppBottomSheet();
	const { post, toggleBookmark } = usePostInteractor(ctx?.uuid);
	const { show } = useAppDialog();
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);
	const { t: tDialog } = useTranslation([LOCALIZATION_NAMESPACE.DIALOGS]);

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
				title: tDialog(`collection.add.title`),
				description: tDialog(`collection.add.description`, {
					returnObjects: true,
				}) as string[],
				actions: [],
			},
			tDialog(`collection.add.placeholder`),
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
						<AssignmentListControlView
							onPressAddNew={onAddNewCollection}
							sectionLabel={t(`collections.collections`)}
							actionButtonLabel={t(`collections.newCollection`)}
						/>
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
