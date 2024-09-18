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
	const { setShowTimelineSelection } = useTimelineController();
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

	function onCreatePost() {
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
	const { colorScheme } = useAppTheme();

	return (
		<View
			style={[styles.root, { backgroundColor: colorScheme.palette.menubar }]}
		>
			<TouchableOpacity style={{ width: 42 }} onPress={onChangeTheme}>
				<AppIcon id={'palette'} emphasis={'high'} />
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 12,
					paddingHorizontal: 16,
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

			<TouchableOpacity
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 12,
					paddingRight: 8,
					paddingHorizontal: 16,
				}}
				onPress={onCreatePost}
			>
				<AppIcon id={'create'} emphasis={'high'} />
			</TouchableOpacity>
			<TimelineWidgetModal />
		</View>
	);
};

const styles = StyleSheet.create({
	root: {
		width: '100%',
		paddingLeft: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 50,
	},
	label: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_700_BOLD,
		fontSize: 16,
	},
});
export default TimelinesHeader;
