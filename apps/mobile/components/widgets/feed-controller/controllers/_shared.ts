import { StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';

export const styles = StyleSheet.create({
	timelineDescription: {
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		marginBottom: 12,
		fontSize: 14,
	},
	timelineTypeText: {
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		fontSize: 20,
	},
	timelineTargetText: {
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		fontSize: 16,
		marginBottom: 16,
	},
});
