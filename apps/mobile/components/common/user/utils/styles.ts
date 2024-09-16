import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	primaryText: {
		color: APP_FONT.HIGH_EMPHASIS,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
	secondaryText: {
		color: APP_FONT.MEDIUM_EMPHASIS,
		fontSize: 12,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});

export default styles;
