import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
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
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { NativeTextBold } from '#/ui/NativeText';
import NavBarFactory from '#/components/topnavbar/components/NavBarFactory';
import RoutingUtils from '#/utils/routing.utils';

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

	const _label = LocalizationService.timelineLabelText(
		State.feedType,
		State.query,
		driver,
	);

	const MENU_ITEMS = [
		{
			iconId: 'filter-outline',
			onPress: onViewTimelineController,
			hidden: State.feedType === TimelineFetchMode.IDLE,
		},
		{
			iconId: 'user-guide',
			onPress: RoutingUtils.toTimelineUserGuide,
		},
	];

	return (
		<NavBarFactory
			menuItems={MENU_ITEMS}
			LabelComponent={
				<NativeTextBold
					style={[styles.label, { color: theme.primary, fontSize: 24 }]}
					numberOfLines={1}
				>
					{_label || 'Unknown'}
				</NativeTextBold>
			}
			animatedStyle={animatedStyle}
		/>
	);
}

const styles = StyleSheet.create({
	label: {
		fontSize: 16,
	},
});

export default NavBar_Feed;
