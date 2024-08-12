import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	primaryText: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
	secondaryText: {
		color: '#888',
		fontSize: 12,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});

export default styles;
