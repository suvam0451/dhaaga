import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import { APP_THEME } from '../styles/AppTheme';
import { useTimelineController } from './common/timeline/api/useTimelineController';
import TimelineWidgetModal from './widgets/timelines/core/Modal';
import { useActivityPubRestClientContext } from '../states/useActivityPubRestClient';

type HeadersProps = {
	HIDDEN_SECTION_HEIGHT: number;
	SHOWN_SECTION_HEIGHT: number;
	label?: string;
};
const TimelinesHeader = ({ HIDDEN_SECTION_HEIGHT, label }: HeadersProps) => {
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
		<View
			style={[
				styles.subHeader,
				{
					height: HIDDEN_SECTION_HEIGHT,
				},
			]}
		>
			<Ionicons name="menu" size={24} color="white" style={{ opacity: 0.6 }} />
			<Pressable
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 12,
					paddingHorizontal: 16,
				}}
				onPress={onIconPress}
			>
				<Text
					style={[
						styles.conversation,
						{
							opacity: 0.6,
						},
					]}
				>
					{label || 'Home'}
				</Text>
				<Ionicons
					name="chevron-down"
					color={'white'}
					size={20}
					style={{ opacity: 0.6, marginLeft: 4, marginTop: 2 }}
				/>
			</Pressable>

			<Ionicons
				name="settings-outline"
				size={24}
				color="white"
				style={{ opacity: 0.6 }}
			/>

			<TimelineWidgetModal />
		</View>
	);
};

const styles = StyleSheet.create({
	subHeader: {
		width: '100%',
		paddingHorizontal: 10,
		backgroundColor: APP_THEME.DARK_THEME_MENUBAR,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	conversation: { color: 'white', fontSize: 16, fontWeight: 'bold' },
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
