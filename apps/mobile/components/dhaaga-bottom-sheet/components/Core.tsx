import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import useBottomSheetHeight from '#/hooks/anim/useBottomSheetHeight';
import WithComposerContext from '#/features/composer/contexts/useComposerCtx';
import ComposerPresenter from '#/features/composer/presenters/ComposerPresenter';
import UserPeekSheetPresenter from '#/features/user-profiles/presenters/UserPeekSheetPresenter';
import AppBottomSheetPostMoreActions from '../modules/AppBottomSheetPostMoreActions';
import ABS_Select_Account from '../modules/ABS_Select_Account';
import ThemeSelectBottomSheet from '../modules/ThemeSelectBottomSheet';
import ABS_Link_Preview from '../modules/ABS_Link_Preview';
import ABS_TagDetails from '../modules/ABS_TagDetails';
import { APP_FONTS } from '#/styles/AppFonts';
import AppBottomSheetUserMoreActions from '../modules/AppBottomSheetUserMoreActions';
import HubAddTagBottomSheet from '#/components/dhaaga-bottom-sheet/hub/HubAddTagBottomSheet';
import HubAddUserBottomSheet from '#/components/dhaaga-bottom-sheet/hub/HubAddUserBottomSheet';
import ShowCommentsBottomSheet from '#/components/dhaaga-bottom-sheet/summary/ShowCommentsBottomSheet';
import ShowLikesBottomSheet from '#/components/dhaaga-bottom-sheet/summary/ShowLikesBottomSheet';
import ShowSharesBottomSheet from '#/components/dhaaga-bottom-sheet/summary/ShowSharesBottomSheet';
import ABS_Post_Preview from '#/components/dhaaga-bottom-sheet/modules/ABS_Post_Preview';
import ABS_Add_Reaction from '#/components/dhaaga-bottom-sheet/modules/ABS_Add_Reaction';
import ABS_Add_Profile from '#/components/dhaaga-bottom-sheet/modules/ABS_Add_Profile';
import { appDimensions, appVerticalIndex } from '#/styles/dimensions';
import BookmarkBottomSheet from '#/components/dhaaga-bottom-sheet/modules/BookmarkBottomSheet';
import FeedOptionsBottomSheet from '#/components/dhaaga-bottom-sheet/modules/FeedOptionsBottomSheet';
import HubFeedAddBottomSheet from '#/components/dhaaga-bottom-sheet/hub/HubFeedAddBottomSheet';
import MoreActionsSheetPresenter from '#/features/feeds/presenters/MoreActionsSheetPresenter';
import { Fragment } from 'react';
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

	return (
		<View style={styles.handleContainer}>
			<View
				style={[
					styles.handleContent,
					{
						height: visible ? 3 : 0,
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
	const { type } = useAppBottomSheet();

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
			return (
				<WithComposerContext>
					<ComposerPresenter />
				</WithComposerContext>
			);
		case APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK:
			return <UserPeekSheetPresenter />;
		case APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS:
			return <AppBottomSheetPostMoreActions />;
		case APP_BOTTOM_SHEET_ENUM.MORE_FEED_ACTIONS:
			return <MoreActionsSheetPresenter />;
		case APP_BOTTOM_SHEET_ENUM.REACTION_DETAILS:
			return <ShowReactionDetailsBottomSheet />;
		case APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT:
			return <ABS_Select_Account />;
		case APP_BOTTOM_SHEET_ENUM.SWITCH_THEME_PACK:
			return <ThemeSelectBottomSheet />;
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
			return <ABS_Post_Preview />;
		case APP_BOTTOM_SHEET_ENUM.ADD_REACTION:
			return <ABS_Add_Reaction />;

		default: {
			return (
				<WithComposerContext>
					<ComposerPresenter />
				</WithComposerContext>
			);
		}
	}
}

function AppBottomSheet() {
	const { animStyle } = useBottomSheetHeight();

	const { visible, hide } = useAppBottomSheet();
	const { theme } = useAppTheme();

	return (
		<Fragment>
			<Pressable
				style={{
					position: 'absolute',
					height: visible ? '100%' : 'auto',
					width: '100%',
					backgroundColor: theme.palette.bg,
					zIndex: appVerticalIndex.sheetBackdrop,
					opacity: 0.42,
				}}
				onPress={hide}
			/>
			<View
				style={{
					width: '100%',
					position: 'absolute',
					height: visible ? 'auto' : 0,
					zIndex: appVerticalIndex.sheetContent,
					bottom: 0,
				}}
			>
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
			</View>
		</Fragment>
	);
}

const styles = StyleSheet.create({
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
	},
	rootContainer: {
		bottom: 0,
		width: '100%',
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		zIndex: appVerticalIndex.sheetContent,
	},
	text: {
		textAlign: 'center',
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD, // 400 previously
	},
});

export default AppBottomSheet;
