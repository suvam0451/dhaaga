import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import useBottomSheetHeight from '#/hooks/anim/useBottomSheetHeight';
import PostComposerSheet from '#/features/composer/PostComposerSheet';
import UserPeekSheetPresenter from '#/components/dhaaga-bottom-sheet/preview/UserPeekSheetPresenter';
import AppBottomSheetPostMoreActions from '../modules/AppBottomSheetPostMoreActions';
import ABS_Select_Account from '../modules/ABS_Select_Account';
import ABS_Link_Preview from '../modules/ABS_Link_Preview';
import ABS_TagDetails from '../modules/ABS_TagDetails';
import AppBottomSheetUserMoreActions from '../modules/AppBottomSheetUserMoreActions';
import HubAddTagBottomSheet from '#/components/dhaaga-bottom-sheet/hub/HubAddTagBottomSheet';
import HubAddUserBottomSheet from '#/components/dhaaga-bottom-sheet/hub/HubAddUserBottomSheet';
import ShowCommentsBottomSheet from '#/components/dhaaga-bottom-sheet/summary/ShowCommentsBottomSheet';
import ShowLikesBottomSheet from '#/components/dhaaga-bottom-sheet/summary/ShowLikesBottomSheet';
import ShowSharesBottomSheet from '#/components/dhaaga-bottom-sheet/summary/ShowSharesBottomSheet';
import AuthoredPostPreviewBottomSheet from '#/components/dhaaga-bottom-sheet/composer/AuthoredPostPreviewBottomSheet';
import ABS_Add_Reaction from '#/components/dhaaga-bottom-sheet/modules/ABS_Add_Reaction';
import ABS_Add_Profile from '#/components/dhaaga-bottom-sheet/modules/ABS_Add_Profile';
import { appDimensions, appVerticalIndex } from '#/styles/dimensions';
import BookmarkBottomSheet from '#/components/dhaaga-bottom-sheet/modules/BookmarkBottomSheet';
import FeedOptionsBottomSheet from '#/components/dhaaga-bottom-sheet/modules/FeedOptionsBottomSheet';
import HubFeedAddBottomSheet from '#/components/dhaaga-bottom-sheet/hub/HubFeedAddBottomSheet';
import AtProtoFeedMoreOptions from '#/components/dhaaga-bottom-sheet/AtProtoFeedMoreOptions';
import ShowReactionDetailsBottomSheet from '#/components/dhaaga-bottom-sheet/summary/ShowReactionDetailsBottomSheet';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';

/**
 * The little handle thingy on top of every bottom sheet
 * @constructor
 */
function Handle() {
	const { theme } = useAppTheme();
	const { visible } = useAppBottomSheet();

	if (!visible) return <View />;
	return (
		<View style={styles.handleContainer}>
			<View
				style={[
					styles.handleContent,
					{
						backgroundColor: theme.secondary.a50,
					},
				]}
			/>
		</View>
	);
}
/**
 * Responsible for generating content
 */
function Factory() {
	const { type, visible } = useAppBottomSheet();

	// remove content while invisible
	if (!visible) return <View />;

	switch (type) {
		/**
		 * Hub Area
		 */
		case APP_BOTTOM_SHEET_ENUM.ADD_HUB_TAG:
			return <HubAddTagBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.ADD_HUB_USER:
			return <HubAddUserBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.ADD_HUB_FEED:
			return <HubFeedAddBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.ADD_PROFILE:
		case APP_BOTTOM_SHEET_ENUM.APP_PROFILE:
			return <ABS_Add_Profile />;

		/**
		 * Uncategorized
		 */
		case APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER:
			return <PostComposerSheet />;
		case APP_BOTTOM_SHEET_ENUM.USER_PREVIEW:
			return <UserPeekSheetPresenter />;
		case APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS:
			return <AppBottomSheetPostMoreActions />;
		case APP_BOTTOM_SHEET_ENUM.MORE_FEED_ACTIONS:
			return <AtProtoFeedMoreOptions />;
		case APP_BOTTOM_SHEET_ENUM.REACTION_DETAILS:
			return <ShowReactionDetailsBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT:
			return <ABS_Select_Account />;
		case APP_BOTTOM_SHEET_ENUM.FEED_SETTINGS:
			return <FeedOptionsBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.LINK:
			return <ABS_Link_Preview />;
		case APP_BOTTOM_SHEET_ENUM.HASHTAG:
			return <ABS_TagDetails />;
		case APP_BOTTOM_SHEET_ENUM.MORE_USER_ACTIONS:
			return <AppBottomSheetUserMoreActions />;
		case APP_BOTTOM_SHEET_ENUM.ADD_BOOKMARK:
			return <BookmarkBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.POST_SHOW_REPLIES:
			return <ShowCommentsBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.POST_SHOW_LIKES:
			return <ShowLikesBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.POST_SHOW_SHARES:
			return <ShowSharesBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.POST_PREVIEW:
			return <AuthoredPostPreviewBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.ADD_REACTION:
			return <ABS_Add_Reaction />;
		default: {
			return <View />;
		}
	}
}

function AppBottomSheet() {
	const { animStyle } = useBottomSheetHeight();

	const { visible, hide } = useAppBottomSheet();
	const { theme } = useAppTheme();

	return (
		<>
			<Pressable
				style={[
					styles.backdrop,
					{
						height: visible ? '100%' : 'auto',
						backgroundColor: theme.background.a0,
					},
				]}
				onPress={hide}
			/>
			<Animated.View
				style={[
					styles.rootContainer,
					{ backgroundColor: theme.background.a10 },
					animStyle,
				]}
			>
				<Handle />
				<Factory />
			</Animated.View>
		</>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		position: 'absolute',
		width: '100%',
		zIndex: appVerticalIndex.sheetBackdrop,
		opacity: 0.42,
	},
	rootContainer: {
		width: '100%',
		position: 'absolute',
		zIndex: appVerticalIndex.sheetContent,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		bottom: 0,
	},
	handleContainer: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		left: '50%',
		transform: [{ translateX: '-50%' }],
		top: 10,
		zIndex: 9000,
	},
	handleContent: {
		width: 42,
		marginBottom: 16,
		borderRadius: 16,
		height: 3,
	},
});

export default AppBottomSheet;
