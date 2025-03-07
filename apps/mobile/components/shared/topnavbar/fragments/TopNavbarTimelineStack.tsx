import {
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import TimelineWidgetModal from '../../../widgets/timelines/core/Modal';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { router } from 'expo-router';
import TopNavbarBackButton from './TopNavbarBackButton';
import { AppIcon } from '../../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { LocalizationService } from '../../../../services/localization.service';
import {
	PostTimelineStateAction,
	usePostTimelineState,
	usePostTimelineDispatch,
} from '@dhaaga/core';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppBottomSheet_TimelineReference,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../states/_global';

/**
 * A custom navbar that invokes
 * the timeline switcher, when
 * the label is clicked
 *
 * NOTE: ScrollView not included
 */
function TimelinesHeader() {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet();
	const { attach } = useAppBottomSheet_TimelineReference();

	const State = usePostTimelineState();
	const dispatch = usePostTimelineDispatch();

	function onIconPress() {
		if (!router) {
			dispatch({
				type: PostTimelineStateAction.HIDE_WIDGET,
			});
		} else {
			dispatch({
				type: PostTimelineStateAction.SHOW_WIDGET,
			});
		}
	}

	function onViewTimelineController() {
		attach(State, dispatch);
		show(APP_BOTTOM_SHEET_ENUM.TIMELINE_CONTROLLER);
	}

	function onUserGuidePress() {
		router.push(APP_ROUTING_ENUM.GUIDE_TIMELINES);
	}

	const _label = LocalizationService.timelineLabelText(
		State.feedType,
		State.query,
		driver,
	);

	return (
		<View style={[styles.root, { backgroundColor: theme.background.a10 }]}>
			<View style={[styles.menuSection, { justifyContent: 'flex-start' }]}>
				<TopNavbarBackButton />
			</View>

			<TouchableOpacity
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					height: '100%',
					flex: 1,
					justifyContent: 'center',
					maxWidth: '40%',
				}}
				onPress={onIconPress}
			>
				<Text
					style={[styles.label, { color: theme.primary.a0 }]}
					numberOfLines={1}
				>
					{_label || 'Unknown'}
				</Text>
				{/*<View*/}
				{/*	style={{*/}
				{/*		marginLeft: 4,*/}
				{/*		marginTop: 2,*/}
				{/*	}}*/}
				{/*>*/}
				{/*	<AppIcon id={'chevron-down'} color={theme.primary.a0} size={20} />*/}
				{/*</View>*/}
			</TouchableOpacity>

			<View
				style={[
					styles.menuSection,
					{ justifyContent: 'flex-end', paddingRight: 8 },
				]}
			>
				<Pressable
					style={{
						padding: appDimensions.topNavbar.padding,
						marginLeft: appDimensions.topNavbar.marginLeft,
					}}
					onPress={onViewTimelineController}
				>
					<AppIcon
						id={'layers-outline'}
						size={appDimensions.topNavbar.iconSize}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						onPress={onViewTimelineController}
					/>
				</Pressable>
				<Pressable
					style={{
						padding: appDimensions.topNavbar.padding,
						marginLeft: appDimensions.topNavbar.marginLeft,
					}}
					onPress={onUserGuidePress}
				>
					<AppIcon
						id={'user-guide'}
						size={appDimensions.topNavbar.iconSize}
						color={theme.secondary.a20}
						onPress={onUserGuidePress}
					/>
				</Pressable>
			</View>
			<TimelineWidgetModal />
		</View>
	);
}

const styles = StyleSheet.create({
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
		height: appDimensions.topNavbar.height,
	},
	label: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		fontSize: 16,
	},
});
export default TimelinesHeader;
