import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../styles/AppTheme';
import { useTimelineController } from './common/timeline/api/useTimelineController';
import TimelineWidgetModal from './widgets/timelines/core/Modal';
import { useActivityPubRestClientContext } from '../states/useActivityPubRestClient';
import { APP_FONTS } from '../styles/AppFonts';
import { AppSelectedAccountIndicator } from './headers/AppHeaderStackPage';

type HeadersProps = {
	label: string;
};
const TimelinesHeader = ({ label }: HeadersProps) => {
	const { client } = useActivityPubRestClientContext();
	const { setShowTimelineSelection } = useTimelineController();

	function onIconPress() {
		if (!client) {
			setShowTimelineSelection(false);
		} else {
			setShowTimelineSelection(true);
		}
	}

	return (
		<View style={styles.root}>
			<Ionicons name="menu" size={24} color={APP_FONT.MONTSERRAT_BODY} />
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 12,
					paddingHorizontal: 16,
				}}
				onPress={onIconPress}
			>
				<Text style={[styles.label]}>{label || 'Home'}</Text>
				<Ionicons
					name="chevron-down"
					color={APP_FONT.MONTSERRAT_BODY}
					size={20}
					style={{ marginLeft: 4, marginTop: 2 }}
				/>
			</TouchableOpacity>
			<AppSelectedAccountIndicator />
			<TimelineWidgetModal />
		</View>
	);
};

const styles = StyleSheet.create({
	root: {
		width: '100%',
		paddingLeft: 10,
		backgroundColor: APP_THEME.DARK_THEME_MENUBAR,
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
	searchText: {
		color: '#8B8B8B',
		fontSize: 17,
		lineHeight: 22,
		marginLeft: 8,
	},
	searchBox: {
		paddingVertical: 8,
		paddingHorizontal: 10,
		backgroundColor: '#0F0F0F',
		borderRadius: 10,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
});
export default TimelinesHeader;
