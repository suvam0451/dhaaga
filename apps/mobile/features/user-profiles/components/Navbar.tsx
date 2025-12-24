import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import type { UserObjectType } from '@dhaaga/bridge';
import { router } from 'expo-router';

type UserViewNavbarProps = {
	acct: UserObjectType;
};

function Navbar({}: UserViewNavbarProps) {
	function onPressBack() {
		if (router.canGoBack()) {
			router.back();
		}
	}

	return (
		<View style={[styles.root]}>
			<TouchableOpacity
				style={styles.backButtonContainer}
				onPress={onPressBack}
			>
				<AppIcon
					id={'chevron-left'}
					color={'rgba(236, 236, 236, 0.87)'}
					onPress={onPressBack}
					size={appDimensions.topNavbar.iconSize}
				/>
			</TouchableOpacity>
		</View>
	);
}

export default Navbar;

const styles = StyleSheet.create({
	root: {
		paddingHorizontal: 12,
		paddingVertical: 16,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		position: 'absolute',
		zIndex: 10,
	},
	backButtonContainer: {
		padding: appDimensions.topNavbar.padding,
		marginLeft: appDimensions.topNavbar.marginLeft,
		backgroundColor: 'rgba(40, 40, 40, 0.6)',
		borderRadius: '100%',
	},
});
