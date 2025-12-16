import { StyleSheet } from 'react-native';
import { appDimensions } from '../../../../styles/dimensions';

const styles = StyleSheet.create({
	subHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: appDimensions.topNavbar.simpleVariantHeight,
	},
	navbarTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	navbarTitle: {
		fontSize: 16,
	},
});

export default styles;
