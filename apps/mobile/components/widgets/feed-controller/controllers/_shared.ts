import { StyleSheet } from 'react-native';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

export const styles = StyleSheet.create({
	timelineDescription: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		maxWidth: '60%',
		marginTop: 12,
		fontSize: 14,
	},
	timelineTypeText: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
	},
	timelineTargetText: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		color: APP_THEME.COLOR_SCHEME_D_NORMAL,
		fontSize: 14,
		opacity: 0.75,
	},
});
