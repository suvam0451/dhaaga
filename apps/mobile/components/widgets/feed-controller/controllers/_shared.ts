import { StyleSheet } from 'react-native';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

export const styles = StyleSheet.create({
	timelineDescription: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		marginTop: 12,
		fontSize: 14,
	},
	timelineTypeText: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		color: '#f5f5f5',
		fontSize: 16,
	},
	timelineTargetText: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		color: APP_THEME.COLOR_SCHEME_D_NORMAL,
		fontSize: 14,
		opacity: 0.75,
	},
});
