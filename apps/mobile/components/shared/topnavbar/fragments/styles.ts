import { StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { appDimensions } from '../../../../styles/dimensions';

const styles = StyleSheet.create({
	subHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#1c1c1c',
		height: appDimensions.topNavbar.height,
	},
	navbarTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	navbarTitle: {
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
});

export default styles;
