import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import {
	usePostEventBusActions,
	usePostEventBusStore,
} from '#/hooks/pubsub/usePostEventBus';
import { FlatList, View } from 'react-native';
import AssignmentSheetBookmarkView from '#/features/collections/views/AssignmentSheetBookmarkView';
import useDbAddPostToCollection from '#/states/db/useDbAddPostToCollection';
import CollectionItem from '#/features/collections/components/CollectionItem';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import AddNewProfile from '#/features/hub/allocators/AddNewProfile';
import { appDimensions } from '#/styles/dimensions';
import { PostInspector } from '@dhaaga/bridge';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';
import { NativeTextMedium } from '#/ui/NativeText';

function BookmarkBottomSheet() {
	const { theme } = useAppTheme();
	const { ctx } = useAppBottomSheet();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	const postId = ctx.$type === 'post-id' ? ctx.postId : null;
	const { post } = usePostEventBusStore(postId);
	const { toggleBookmark } = usePostEventBusActions(postId);
	const { data, toggle, onRequestAddNewCollection } = useDbAddPostToCollection(
		PostInspector.getContentTarget(post)?.id,
	);

	if (!post) return <View />;

	const _target = PostInspector.getContentTarget(post);
	const IS_BOOKMARKED = _target.interaction.bookmarked;

	return (
		<View style={{ flex: 1 }}>
			<BottomSheetMenu
				title={'N/A'}
				variant={'raised'}
				CustomHeader={
					<AssignmentSheetBookmarkView
						bookmarked={IS_BOOKMARKED}
						toggleBookmark={toggleBookmark}
					/>
				}
			/>
			<FlatList
				data={data}
				ListHeaderComponent={
					<>
						<NativeTextMedium
							style={{
								color: theme.complementary,
								textAlign: 'center',
								marginVertical: appDimensions.timelines.sectionBottomMargin,
								marginBottom: appDimensions.timelines.sectionBottomMargin * 4,
							}}
						>
							{t(`collections.disclaimer`)}
						</NativeTextMedium>
						<AddNewProfile
							onPressAddNew={onRequestAddNewCollection}
							sectionLabel={t(`collections.collections`)}
							actionButtonLabel={t(`collections.newCollection`)}
						/>
					</>
				}
				renderItem={({ item }) => (
					<View style={{ paddingLeft: 16, paddingRight: 8 }}>
						<CollectionItem
							active={item.has}
							activeIconId={'checkmark-circle'}
							inactiveIconId={'add-circle-outline'}
							activeTint={theme.primary}
							inactiveTint={theme.secondary.a30}
							label={item.alias}
							desc={item.desc || t(`collections.fallbackDesc`)}
							onPress={() => {
								toggle(item, post);
							}}
						/>
					</View>
				)}
				contentContainerStyle={{
					paddingBottom: appDimensions.timelines.sectionBottomMargin * 4,
				}}
				ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
			/>
		</View>
	);
}

export default BookmarkBottomSheet;
