import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import TimelineWidgetModal from '../../../widgets/timelines/core/Modal';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { APP_FONTS } from '../../../../styles/AppFonts';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';
import { AppIcon } from '../../../lib/Icon';
import { router } from 'expo-router';
import { TimelineFetchMode } from '../../../common/timeline/utils/timeline.types';

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
	const { client } = useActivityPubRestClientContext();
	const { setShowTimelineSelection, setTimelineType, timelineType } =
		useTimelineController();
	const {
		setVisible,
		setType,
		PostComposerTextSeedRef,
		PostRef,
		updateRequestId,
		ParentRef,
	} = useAppBottomSheet();

	function onIconPress() {
		if (!client) {
			setShowTimelineSelection(false);
		} else {
			setShowTimelineSelection(true);
		}
	}

	function post() {
		PostComposerTextSeedRef.current = null;
		PostRef.current = null;
		ParentRef.current = null;

		setType(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER);
		updateRequestId();
		setVisible(true);
	}

	function onChangeTheme() {
		setType(APP_BOTTOM_SHEET_ENUM.SWITCH_THEME_PACK);
		updateRequestId();
		setVisible(true);
	}

	function goHome() {
		setTimelineType(TimelineFetchMode.IDLE);
		router.navigate('/');
	}

	const { colorScheme } = useAppTheme();

	return (
		<View
			style={[styles.root, { backgroundColor: colorScheme.palette.menubar }]}
		>
			<View style={[styles.menuSection, { justifyContent: 'flex-start' }]}>
				<TouchableOpacity
					style={styles.menuActionButtonContainer}
					onPress={onChangeTheme}
				>
					<AppIcon id={'palette'} emphasis={'high'} />
				</TouchableOpacity>
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
					color={colorScheme.textColor.high}
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
					style={styles.menuActionButtonContainer}
					onPress={post}
				>
					<AppIcon id={'create'} emphasis={'high'} />
				</TouchableOpacity>

				{timelineType !== TimelineFetchMode.IDLE && (
					<TouchableOpacity
						style={styles.menuActionButtonContainer}
						onPress={goHome}
					>
						<AppIcon id={'home'} emphasis={'high'} size={20} />
					</TouchableOpacity>
				)}
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
		height: 42,
	},
	label: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_700_BOLD,
		fontSize: 16,
	},
});
export default TimelinesHeader;
