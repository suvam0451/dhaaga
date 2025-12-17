import { Pressable, StyleSheet, View } from 'react-native';
import APP_ICON_ENUM, { AppIcon } from '../lib/Icon';
import { appDimensions } from '#/styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';

type AccountGreetingNavbarProps = {
	menuItems: {
		iconId: APP_ICON_ENUM;
		onPress?: () => void;
		disabled?: boolean;
	}[];
};

function NavBar_Home({ menuItems }: AccountGreetingNavbarProps) {
	return (
		<View style={[styles.root]}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ marginBottom: 0, flexGrow: 1 }}></View>
				{menuItems.map(({ iconId, disabled, onPress }, i) => (
					<Pressable
						key={i}
						style={{
							padding: appDimensions.topNavbar.padding * 2,
							marginLeft: appDimensions.topNavbar.marginLeft,
							backgroundColor: 'rgba(40, 40, 40, 0.6)',
							borderRadius: '100%',
						}}
						onPress={onPress}
					>
						<AppIcon
							id={iconId}
							emphasis={
								disabled
									? APP_COLOR_PALETTE_EMPHASIS.A40
									: APP_COLOR_PALETTE_EMPHASIS.A10
							}
							onPress={onPress}
							size={appDimensions.topNavbar.iconSize}
						/>
					</Pressable>
				))}
			</View>
		</View>
	);
}

export default NavBar_Home;

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
});
