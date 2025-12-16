import {
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { router } from 'expo-router';
import { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { LocalizationService } from '#/services/localization.service';
import {
	usePostTimelineState,
	usePostTimelineDispatch,
	PostTimelineStateAction,
	TimelineFetchMode,
} from '@dhaaga/core';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import Animated from 'react-native-reanimated';
import { TOP_NAVBAR_MENU_ICON_SIZE } from '#/components/shared/topnavbar/settings';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type Props = {
	animatedStyle?: StyleProp<ViewStyle>;
};

/**
 * A custom navbar that invokes
 * the timeline switcher when
 * the label is clicked
 *
 * NOTE: ScrollView not included
 */
function NavBar_Feed({ animatedStyle }: Props) {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();
	const { show, ctx } = useAppBottomSheet();

	const State = usePostTimelineState();
	const dispatch = usePostTimelineDispatch();

	function onViewTimelineController() {
		show(
			APP_BOTTOM_SHEET_ENUM.FEED_SETTINGS,
			true,
			{
				$type: 'set-feed-options',
				...State,
			},
			() => {
				if (ctx.$type !== 'set-feed-options') return;
				dispatch({
					type: PostTimelineStateAction.SET_QUERY_OPTS,
					payload: ctx,
				});
			},
		);
	}

	function onUserGuidePress() {
		router.push(APP_ROUTING_ENUM.FEED_GUIDE);
	}

	const _label = LocalizationService.timelineLabelText(
		State.feedType,
		State.query,
		driver,
	);

	return (
		<Animated.View style={[styles.container, animatedStyle]}>
			<View style={[styles.root, { backgroundColor: theme.background.a10 }]}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						height: '100%',
						flex: 1,
						marginLeft: 16,
						maxWidth: '40%',
					}}
				>
					<Text
						style={[styles.label, { color: theme.primary, fontSize: 24 }]}
						numberOfLines={1}
					>
						{_label || 'Unknown'}
					</Text>
					<View
						style={{
							marginLeft: 4,
							marginTop: 2,
						}}
					>
						<AppIcon id={'chevron-down'} color={theme.primary} size={20} />
					</View>
				</View>

				<View
					style={[
						styles.menuSection,
						{ justifyContent: 'flex-end', paddingRight: 8 },
					]}
				>
					{State.feedType === TimelineFetchMode.IDLE ? (
						<View />
					) : (
						<Pressable
							style={{
								padding: appDimensions.topNavbar.padding,
								marginLeft: appDimensions.topNavbar.marginLeft,
							}}
							onPress={onViewTimelineController}
						>
							<AppIcon
								id={'filter-outline'}
								size={TOP_NAVBAR_MENU_ICON_SIZE}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
								onPress={onViewTimelineController}
							/>
						</Pressable>
					)}
					<Pressable
						style={{
							padding: appDimensions.topNavbar.padding,
							marginLeft: appDimensions.topNavbar.marginLeft,
						}}
						onPress={onUserGuidePress}
					>
						<AppIcon
							id={'user-guide'}
							size={appDimensions.topNavbar.iconSize + 6}
							color={theme.secondary.a20}
							onPress={onUserGuidePress}
						/>
					</Pressable>
				</View>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	menuSection: {
		flexDirection: 'row',
		alignItems: 'center',
		width: 84,
		height: '100%',
	},
	menuActionButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: '100%',
		paddingHorizontal: 8,
	},
	root: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: appDimensions.topNavbar.simpleVariantHeight,
	},
	label: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		fontSize: 16,
	},
});

export default NavBar_Feed;
