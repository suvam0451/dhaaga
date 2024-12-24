import { Fragment, memo, useMemo } from 'react';
import {
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import useAnimatedHeight from './modules/_api/useAnimatedHeight';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import AppBottomSheetQuickPost from './modules/AppBottomSheetQuickPost';
import PostPreview from './modules/post-preview/PostPreview';
import WithComposerContext from './modules/post-composer/api/useComposerContext';
import PostCompose from './modules/post-composer/pages/PostCompose';
import AppBottomSheetProfilePeek from './modules/profile-peek/AppBottomSheetProfilePeek';
import AppBottomSheetPostMoreActions from './modules/AppBottomSheetPostMoreActions';
import AppBottomSheetReactionDetails from './modules/reaction-details/AppBottomSheetReactionDetails';
import AppBottomSheetSelectAccount from './modules/select-account/AppBottomSheetSelectAccount';
import AppBottomSheetPickThemePack from './modules/theme-pack/AppBottomSheetPickThemePack';
import AppBottomSheetTimelineDetails from './modules/timeline-details/AppBottomSheetTimelineDetails';
import AppBottomSheetLinkPreview from './modules/AppBottomSheetLinkPreview';
import AppBottomSheetHashtag from './modules/AppBottomSheetHashtag';
import { APP_FONTS } from '../../styles/AppFonts';
import AntDesign from '@expo/vector-icons/AntDesign';
import AppBottomSheetUserMoreActions from './modules/AppBottomSheetUserMoreActions';
import {
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';

export enum APP_BOTTOM_SHEET_ENUM {
	QUICK_POST = 'QuickPost',
	APP_PROFILE = 'AppProfile',
	HASHTAG = 'Hashtag',
	LINK = 'Link',
	MORE_POST_ACTIONS = 'MorePostActions',
	MORE_USER_ACTIONS = 'MoreUserActions',
	NA = 'N/A',
	PROFILE_PEEK = 'ProfilePeek',
	REACTION_DETAILS = 'ReactionDetails',
	SELECT_ACCOUNT = 'SelectAccount',
	STATUS_COMPOSER = 'StatusComposer',
	STATUS_MENU = 'StatusMenu',
	STATUS_PREVIEW = 'StatusPreview',
	SWITCH_THEME_PACK = 'SwitchThemePack',
	TIMELINE_CONTROLLER = 'TimeLineController',
}

/**
 * Responsible for generating content
 */
const Factory = memo(() => {
	const { type, stateId, PostComposerTextSeedRef } = useGlobalState(
		useShallow((o) => ({
			type: o.bottomSheet.type,
			stateId: o.bottomSheet.stateId,
			PostComposerTextSeedRef: o.bottomSheet.PostComposerTextSeedRef,
		})),
	);
	return useMemo(() => {
		switch (type) {
			case APP_BOTTOM_SHEET_ENUM.QUICK_POST:
				return <AppBottomSheetQuickPost />;
			case APP_BOTTOM_SHEET_ENUM.APP_PROFILE:
			case APP_BOTTOM_SHEET_ENUM.STATUS_PREVIEW:
				return <PostPreview />;
			case APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER:
				return (
					<WithComposerContext textSeed={PostComposerTextSeedRef}>
						<PostCompose />
					</WithComposerContext>
				);
			case APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK:
				return <AppBottomSheetProfilePeek />;
			case APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS:
				return <AppBottomSheetPostMoreActions />;
			case APP_BOTTOM_SHEET_ENUM.REACTION_DETAILS:
				return <AppBottomSheetReactionDetails />;
			case APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT:
				return <AppBottomSheetSelectAccount />;
			case APP_BOTTOM_SHEET_ENUM.SWITCH_THEME_PACK:
				return <AppBottomSheetPickThemePack />;
			case APP_BOTTOM_SHEET_ENUM.TIMELINE_CONTROLLER:
				return <AppBottomSheetTimelineDetails />;
			case APP_BOTTOM_SHEET_ENUM.LINK:
				return <AppBottomSheetLinkPreview />;
			case APP_BOTTOM_SHEET_ENUM.HASHTAG:
				return <AppBottomSheetHashtag />;
			case APP_BOTTOM_SHEET_ENUM.MORE_USER_ACTIONS:
				return <AppBottomSheetUserMoreActions />;
			default: {
				return (
					<WithComposerContext>
						<PostCompose />
					</WithComposerContext>
				);
			}
		}
	}, [type, stateId]);
});

/**
 * @deprecated
 */
const CloseButton = memo(() => {
	const { visible, hide } = useAppBottomSheet_Improved();
	const { theme } = useAppTheme();
	function onPress() {
		hide();
	}

	if (!visible) return <View />;

	return (
		<TouchableOpacity style={styles.closeButtonRootContainer} onPress={onPress}>
			<View style={styles.internalContainer}>
				<Text style={styles.text}>Close</Text>
				<View style={{ marginLeft: 8 }}>
					<AntDesign name="close" size={20} color={theme.complementary.a0} />
				</View>
			</View>
		</TouchableOpacity>
	);
});

/**
 * Switches what module will be shown
 * in the bottom sheet
 *
 * @param animStyle will animate the height
 * based on active module
 */
const AppBottomSheet = memo(() => {
	const { animStyle } = useAnimatedHeight();

	const { visible, hide, theme } = useGlobalState(
		useShallow((o) => ({
			visible: o.bottomSheet.visible,
			hide: o.bottomSheet.hide,
			theme: o.colorScheme,
		})),
	);

	return (
		<Fragment>
			<Pressable
				style={{
					position: 'absolute',
					height: visible ? '100%' : 'auto',
					width: '100%',
					backgroundColor: theme.palette.bg,
					opacity: 0.48,
					zIndex: 1,
				}}
				onPress={hide}
			/>

			<Animated.View
				style={[
					styles.rootContainer,
					{ backgroundColor: theme.palette.menubar },
					animStyle,
				]}
			>
				<View
					style={{
						position: 'absolute',
						alignItems: 'center',
						justifyContent: 'center',
						left: '50%',
						transform: [{ translateX: '-50%' }],
						top: 8,
					}}
				>
					<View
						style={{
							height: 4,
							width: 48,
							backgroundColor: theme.textColor.low,
							marginBottom: 16,
							borderRadius: 16,
						}}
					/>
				</View>
				<Factory />
			</Animated.View>
		</Fragment>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
		zIndex: 2,
	},
	closeButtonRootContainer: {
		position: 'absolute',
		top: -48,
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
	},
	internalContainer: {
		padding: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},
	text: {
		textAlign: 'center',
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD, // 400 previously
	},
});

export default AppBottomSheet;
