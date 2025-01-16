import { StyleSheet, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { APP_FONT } from '../../../../styles/AppTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONTS } from '../../../../styles/AppFonts';

function CustomTimelineOptions() {
	return (
		<View style={{ height: '100%', display: 'flex' }}>
			<View style={{ flexGrow: 1 }}></View>
			<View>
				<View style={styles.optionContainer}>
					<View style={{ width: 32 }}>
						<MaterialCommunityIcons
							name="antenna"
							size={24}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					</View>
					<View style={{ flexGrow: 1, flex: 1 }}>
						<Text style={{ fontFamily: APP_FONTS.INTER_400_REGULAR }}>
							Add Remote Timeline
						</Text>
					</View>

					<View style={{ flexShrink: 1, minWidth: 24 }}>
						<FontAwesome5
							name="chevron-right"
							size={18}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					</View>
				</View>
				<View style={styles.optionContainer}>
					<View style={{ width: 32 }}>
						<MaterialIcons
							name="dashboard-customize"
							size={24}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					</View>
					<Text>Add Custom Timeline</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	optionContainer: {
		borderRadius: 8,
		backgroundColor: '#444',
		padding: 4,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
});

export default CustomTimelineOptions;
