import { StyleSheet } from 'react-native';
import { APP_FONTS } from './AppFonts';
import { APP_FONT } from './AppTheme';

const appTextStyling = StyleSheet.create({
	postContext: {
		color: APP_FONT.MEDIUM_EMPHASIS,
		marginLeft: 4,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		fontSize: 13,
	},
});

export default appTextStyling;
