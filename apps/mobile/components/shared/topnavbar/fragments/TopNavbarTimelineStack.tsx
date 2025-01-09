import {
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import TimelineWidgetModal from '../../../widgets/timelines/core/Modal';
import { APP_FONTS } from '../../../../styles/AppFonts';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { router } from 'expo-router';
import TopNavbarBackButton from './TopNavbarBackButton';
import { AppIcon } from '../../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { APP_BOTTOM_SHEET_ENUM } from '../../../dhaaga-bottom-sheet/Core';
import { LocalizationService } from '../../../../services/localization.service';
import { ACTION } from '../../../../states/reducers/post-timeline.reducer';
import { useAppBottomSheet_TimelineReference } from '../../../../hooks/utility/global-state-extractors';
import {
	useTimelineDispatch,
	useTimelineManager,
	useTimelineState,
} from '../../../context-wrappers/WithPostTimeline';
import { appDimensions } from '../../../../styles/dimensions';

/**
 * A custom navbar that invokes
 * the timeline switcher, when
 * the label is clicked
 *
 * NOTE: ScrollView not included
 */
function TimelinesHeader() {
	const { theme, show, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			theme: o.colorScheme,
			show: o.bottomSheet.show,
			driver: o.driver,
		})),
	);
	const { attach } = useAppBottomSheet_TimelineReference();

	const State = useTimelineState();
	const dispatch = useTimelineDispatch();
	const manager = useTimelineManager();

	function onIconPress() {
		if (!router) {
			dispatch({
				type: ACTION.HIDE_WIDGET,
			});
		} else {
			dispatch({
				type: ACTION.SHOW_WIDGET,
			});
		}
	}

	function onViewTimelineController() {
		attach(State, dispatch, manager.current);
		show(APP_BOTTOM_SHEET_ENUM.TIMELINE_CONTROLLER);
	}

	function onUserGuidePress() {
		router.push('/user-guide-timelines');
	}

	const _label = LocalizationService.timelineLabelText(
		State.feedType,
		State.query,
		driver,
	);

	return (
		<View style={[styles.root, { backgroundColor: theme.palette.menubar }]}>
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
				<View
					style={{
						marginLeft: 4,
						marginTop: 2,
					}}
				>
					<AppIcon id={'chevron-down'} color={theme.primary.a0} size={20} />
				</View>
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
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_700_BOLD,
		fontSize: 16,
	},
});
export default TimelinesHeader;
