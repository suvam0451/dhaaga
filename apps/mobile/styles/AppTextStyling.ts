import { StyleSheet } from 'react-native';
import { APP_FONTS } from './AppFonts';

const appTextStyling = StyleSheet.create({
	postContext: {
		color: 'rgba(136,136,136,0.87)',
		marginLeft: 4,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		fontSize: 13,
	},
});

export default appTextStyling;
