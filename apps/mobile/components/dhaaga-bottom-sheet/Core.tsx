import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import useAnimatedHeight from './modules/_api/useAnimatedHeight';
import WithComposerContext from '../../features/composer/contexts/useComposerCtx';
import ComposerPresenter from '../../features/composer/presenters/ComposerPresenter';
import UserPeekSheetPresenter from '../../features/user-profiles/presenters/UserPeekSheetPresenter';
import AppBottomSheetPostMoreActions from './modules/AppBottomSheetPostMoreActions';
import AppBottomSheetReactionDetails from './modules/reaction-details/AppBottomSheetReactionDetails';
import ABS_Select_Account from './modules/ABS_Select_Account';
import AppBottomSheetPickThemePack from './modules/theme-pack/AppBottomSheetPickThemePack';
import ABS_Link_Preview from './modules/ABS_Link_Preview';
import ABS_TagDetails from './modules/ABS_TagDetails';
import { APP_FONTS } from '../../styles/AppFonts';
import AppBottomSheetUserMoreActions from './modules/AppBottomSheetUserMoreActions';
import {
	useAppBottomSheet,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import TagAddSheetPresenter from '../../features/social-hub/presenters/TagAddSheetPresenter';
import UserAddSheetPresenter from '../../features/social-hub/presenters/UserAddSheetPresenter';
import ABS_Post_Show_Comments from './modules/ABS_Post_Show_Comments';
import ABS_Post_Show_Likes from './modules/ABS_Post_Show_Likes';
import ABS_Post_Show_Shares from './modules/ABS_Post_Show_Shares';
import ABS_Post_Preview from './modules/ABS_Post_Preview';
import ABS_Add_Reaction from './modules/ABS_Add_Reaction';
import ABS_Add_Profile from './modules/ABS_Add_Profile';
import { appDimensions, appVerticalIndex } from '../../styles/dimensions';
import CollectionAssignmentSheetPresenter from '../../features/collections/presenters/CollectionAssignmentSheetPresenter';
import TimelineControllerSheetPresenter from '../../features/timelines/features/controller/presenters/TimelineControllerSheetPresenter';
import { APP_BOTTOM_SHEET_ENUM } from '../../states/_global';
import FeedAddSheetPresenter from '../../features/social-hub/presenters/FeedAddSheetPresenter';
import MoreActionsSheetPresenter from '../../features/feeds/presenters/MoreActionsSheetPresenter';
import { Fragment } from 'react';

/**
 * The little handle thingy on top of every bottom sheet
 * @constructor
 */
function Handle() {
	const { theme } = useAppTheme();
	const { visible, hide, broadcastEndSession } = useAppBottomSheet();

	return (
		<Animated.View
			style={{
				position: 'absolute',
				alignItems: 'center',
				justifyContent: 'center',
				left: '50%',
				transform: [{ translateX: '-50%' }],
				top: 10,
				zIndex: 9000,
			}}
		>
			<Animated.View
				style={{
					height: visible ? 3 : 0,
					width: 42,
					backgroundColor: theme.secondary.a50,
					marginBottom: 16,
					borderRadius: 16,
				}}
			/>
		</Animated.View>
	);
}
/**
 * Responsible for generating content
 */
function Factory() {
	const { type, animating } = useAppBottomSheet();

	if (animating) return <View />;

	switch (type) {
		case APP_BOTTOM_SHEET_ENUM.ADD_PROFILE:
		case APP_BOTTOM_SHEET_ENUM.APP_PROFILE:
			return <ABS_Add_Profile />;
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
			return <AppBottomSheetReactionDetails />;
		case APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT:
			return <ABS_Select_Account />;
		case APP_BOTTOM_SHEET_ENUM.SWITCH_THEME_PACK:
			return <AppBottomSheetPickThemePack />;
		case APP_BOTTOM_SHEET_ENUM.TIMELINE_CONTROLLER:
			return <TimelineControllerSheetPresenter />;
		case APP_BOTTOM_SHEET_ENUM.LINK:
			return <ABS_Link_Preview />;
		case APP_BOTTOM_SHEET_ENUM.HASHTAG:
			return <ABS_TagDetails />;
		case APP_BOTTOM_SHEET_ENUM.MORE_USER_ACTIONS:
			return <AppBottomSheetUserMoreActions />;
		case APP_BOTTOM_SHEET_ENUM.ADD_BOOKMARK:
			return <CollectionAssignmentSheetPresenter />;
		case APP_BOTTOM_SHEET_ENUM.ADD_HUB_TAG:
			return <TagAddSheetPresenter />;
		case APP_BOTTOM_SHEET_ENUM.ADD_HUB_USER:
			return <UserAddSheetPresenter />;
		case APP_BOTTOM_SHEET_ENUM.ADD_HUB_FEED:
			return <FeedAddSheetPresenter />;
		case APP_BOTTOM_SHEET_ENUM.POST_SHOW_REPLIES:
			return <ABS_Post_Show_Comments />;
		case APP_BOTTOM_SHEET_ENUM.POST_SHOW_LIKES:
			return <ABS_Post_Show_Likes />;
		case APP_BOTTOM_SHEET_ENUM.POST_SHOW_SHARES:
			return <ABS_Post_Show_Shares />;
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
	const { animStyle } = useAnimatedHeight();

	const { visible, hide, broadcastEndSession } = useAppBottomSheet();
	const { theme } = useAppTheme();

	function onBottomSheetCloseEvent() {
		broadcastEndSession();
		hide();
	}

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
				onPress={onBottomSheetCloseEvent}
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
