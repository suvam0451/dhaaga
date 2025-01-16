import { Pressable, StyleSheet, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { appDimensions } from '../../../styles/dimensions';
import { APP_ICON_ENUM, AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppUserObject } from '../../../types/app-user.types';

type UserViewNavbarProps = {
	acct: AppUserObject;
};

function UserViewNavbar({}: UserViewNavbarProps) {
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

	return (
		<View style={[styles.container]}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ marginBottom: 0, flexGrow: 1 }}></View>
				{MENU_ITEMS.map(({ iconId, onPress }, i) => (
					<Pressable
						key={i}
						style={{
							padding: appDimensions.topNavbar.padding * 2,
							marginLeft: appDimensions.topNavbar.marginLeft,
							backgroundColor: 'rgba(40, 40, 40, 0.75)',
							borderRadius: '100%',
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

export default UserViewNavbar;

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
