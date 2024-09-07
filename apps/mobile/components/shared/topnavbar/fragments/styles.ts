import { StyleSheet } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

const styles = StyleSheet.create({
	subHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#1c1c1c',
		height: 50,
	},
	navbarTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	navbarTitle: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
});

export default styles;
