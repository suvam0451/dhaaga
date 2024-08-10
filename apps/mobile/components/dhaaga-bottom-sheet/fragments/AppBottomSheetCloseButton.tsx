import { memo } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_FONT } from '../../../styles/AppTheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAppBottomSheet } from '../modules/_api/useAppBottomSheet';

const AppBottomSheetCloseButton = memo(() => {
	const { visible, setVisible } = useAppBottomSheet();

	function onPress() {
		setVisible(false);
	}

	if (!visible) return <View />;

	return (
		<TouchableOpacity style={styles.rootContainer} onPress={onPress}>
			<View style={styles.internalContainer}>
				<Text style={styles.text}>Close</Text>
				<View style={{ marginLeft: 8 }}>
					<AntDesign
						name="close"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		position: 'absolute',
		top: -48,
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
	},
	internalContainer: {
		// backgroundColor: '#363636',
		backgroundColor: '#ea6f93',
		padding: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},

	text: {
		textAlign: 'center',
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD, // 400 previously
		// color: APP_FONT.MONTSERRAT_BODY,
		color: APP_FONT.MONTSERRAT_HEADER,
	},
});
export default AppBottomSheetCloseButton;
