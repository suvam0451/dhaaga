import { Pressable, StyleSheet, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { appDimensions } from '#/styles/dimensions';
import { AppIcon } from '../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import type { UserObjectType } from '@dhaaga/bridge';
import { router } from 'expo-router';

type UserViewNavbarProps = {
	acct: UserObjectType;
};

function Navbar_UserDetail({}: UserViewNavbarProps) {
	function onPressBack() {
		if (router.canGoBack()) {
			router.back();
		}
	}

	return (
		<View style={[styles.container]}>
			<View style={{ flexDirection: 'row' }}>
				<Pressable
					style={{
						padding: appDimensions.topNavbar.padding * 2,
						marginLeft: appDimensions.topNavbar.marginLeft,
						backgroundColor: 'rgba(40, 40, 40, 0.64)',
						borderRadius: '100%',
					}}
					onPress={onPressBack}
				>
					<AppIcon
						id={'chevron-left'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						onPress={onPressBack}
						size={appDimensions.topNavbar.iconSize}
					/>
				</Pressable>
			</View>
		</View>
	);
}

export default Navbar_UserDetail;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		paddingVertical: 16,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		position: 'absolute',
		zIndex: 10,
	},
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD, // fontWeight: '600',
	},
});
