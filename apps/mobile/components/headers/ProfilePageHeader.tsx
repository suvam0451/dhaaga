import {
	GestureResponderEvent,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../styles/AppTheme';
import { useAppDrawerContext } from '../../states/useAppDrawer';

type HeadersProps = {
	HIDDEN_SECTION_HEIGHT: number;
	SHOWN_SECTION_HEIGHT: number;
	title: string;
	onLeftIconPress: (event: GestureResponderEvent) => void;
};
const TimelinesHeader = ({
	title,
	HIDDEN_SECTION_HEIGHT,
	onLeftIconPress,
}: HeadersProps) => {
	const { open, setOpen } = useAppDrawerContext();

	function onMenuClick() {
		if (!open && setOpen !== undefined) setOpen(true);
	}

	return (
		<>
			<View
				style={[
					styles.subHeader,
					{
						backgroundColor: '#1c1c1c',
						height: HIDDEN_SECTION_HEIGHT,
					},
				]}
			>
				<TouchableOpacity
					onPress={onLeftIconPress}
					style={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'row',
						paddingHorizontal: 8,
					}}
				>
					<Ionicons
						name="chevron-back"
						size={24}
						color="rgba(255, 255, 255, 0.6)"
					/>
				</TouchableOpacity>
				<View style={styles.navbarTitleContainer}>
					<Text style={styles.navbarTitle}>{title}</Text>
				</View>
				<View
					style={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'row',
						paddingHorizontal: 10,
					}}
					onTouchStart={onMenuClick}
				>
					<Ionicons
						name="menu-outline"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	subHeader: {
		width: '100%',
		// paddingHorizontal: 10,
		// backgroundColor: "#1c1c1c",
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'blue',
	},
	navbarTitleContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	navbarTitle: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		fontFamily: 'Montserrat-Bold',
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
