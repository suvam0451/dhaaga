import { Pressable, StyleSheet, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { appDimensions } from '#/styles/dimensions';
import APP_ICON_ENUM, { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import type { UserObjectType } from '@dhaaga/bridge';
import { router } from 'expo-router';

type UserViewNavbarProps = {
	acct: UserObjectType;
};

function Navbar_UserDetail({}: UserViewNavbarProps) {
	const MENU_ITEMS = [
		{
			iconId: 'cog' as APP_ICON_ENUM,
			onPress: () => {},
		},
		{
			iconId: 'user-guide' as APP_ICON_ENUM,
			onPress: () => {},
		},
	];

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
						backgroundColor: 'rgba(40, 40, 40, 0.56)',
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
				<View style={{ marginBottom: 0, flexGrow: 1 }}></View>
				{MENU_ITEMS.map(({ iconId, onPress }, i) => (
					<Pressable
						key={i}
						style={{
							padding: appDimensions.topNavbar.padding * 2,
							marginLeft: appDimensions.topNavbar.marginLeft,
							backgroundColor: 'rgba(40, 40, 40, 0.75)',
						}}
						onPress={onPress}
					>
						<AppIcon
							id={iconId}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
							onPress={onPress}
							size={appDimensions.topNavbar.iconSize}
						/>
					</Pressable>
				))}
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
