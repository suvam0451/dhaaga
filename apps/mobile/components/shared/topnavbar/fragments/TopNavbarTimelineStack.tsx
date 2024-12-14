import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import TimelineWidgetModal from '../../../widgets/timelines/core/Modal';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppBottomSheet } from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import useGlobalState, {
	APP_BOTTOM_SHEET_ENUM,
} from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { router } from 'expo-router';
import TopNavbarBackButton from './TopNavbarBackButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type HeadersProps = {
	title: string;
};

/**
 * A custom navbar that invokes
 * the timeline switcher, when
 * the label is clicked
 *
 * NOTE: ScrollView not included
 */
const TimelinesHeader = ({ title }: HeadersProps) => {
	const { colorScheme, show, setPostRef } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			colorScheme: o.colorScheme,
			show: o.bottomSheet.show,
			setPostRef: o.bottomSheet.setPostRef,
		})),
	);
	const { setShowTimelineSelection } = useTimelineController();
	const { PostComposerTextSeedRef, ParentRef } = useAppBottomSheet();

	function onIconPress() {
		if (!router) {
			setShowTimelineSelection(false);
		} else {
			setShowTimelineSelection(true);
		}
	}

	function post() {
		PostComposerTextSeedRef.current = null;
		ParentRef.current = null;
		setPostRef(null);
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	function onViewTimelineController() {
		show(APP_BOTTOM_SHEET_ENUM.TIMELINE_CONTROLLER);
	}

	function onUserGuidePress() {
		router.push('/user-guide-timelines');
	}

	return (
		<View
			style={[styles.root, { backgroundColor: colorScheme.palette.menubar }]}
		>
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
				}}
				onPress={onIconPress}
			>
				<Text
					style={[styles.label, { color: colorScheme.textColor.high }]}
					numberOfLines={1}
				>
					{title || 'Home'}
				</Text>
				<Ionicons
					name="chevron-down"
					color={colorScheme.textColor.medium}
					size={20}
					style={{ marginLeft: 4, marginTop: 2 }}
				/>
			</TouchableOpacity>

			<View
				style={[
					styles.menuSection,
					{ justifyContent: 'flex-end', paddingRight: 8 },
				]}
			>
				<TouchableOpacity
					style={{ paddingHorizontal: 6 }}
					onPress={onViewTimelineController}
				>
					<Ionicons
						name="information-circle-outline"
						size={24}
						color={colorScheme.textColor.high}
					/>
				</TouchableOpacity>

				<Pressable
					style={{ padding: 4, transform: [{ translateX: -1 }] }}
					onPress={onUserGuidePress}
				>
					<MaterialIcons
						name="notes"
						size={24}
						color={colorScheme.textColor.high}
						style={{ transform: [{ scaleX: -1 }] }}
					/>
				</Pressable>
			</View>
			<TimelineWidgetModal />
		</View>
	);
};

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
		height: 48,
	},
	label: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_700_BOLD,
		fontSize: 16,
	},
});
export default TimelinesHeader;
