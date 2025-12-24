import { Pressable, StyleSheet, View } from 'react-native';
import APP_ICON_ENUM, { AppIcon } from '#/components/lib/Icon';
import { appDimensions } from '#/styles/dimensions';
import RoutingUtils from '#/utils/routing.utils';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { router } from 'expo-router';

const MENU_ITEMS = [
	{
		iconId: 'language' as APP_ICON_ENUM,
		onPress: RoutingUtils.toSelectAppLanguage,
	},
	{
		iconId: 'person' as APP_ICON_ENUM,
		onPress: RoutingUtils.toAccountManagement,
	},
	{
		iconId: 'cog' as APP_ICON_ENUM,
		onPress: RoutingUtils.toAppSettings,
	},
	{
		iconId: 'user-guide' as APP_ICON_ENUM,
		onPress: () => {
			router.navigate(APP_ROUTING_ENUM.GUIDE_MY_PROFILE);
		},
	},
];

function NavBar_Home() {
	return (
		<View style={[styles.root]}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ marginBottom: 0, flexGrow: 1 }}></View>
				{MENU_ITEMS.map(({ iconId, onPress }, i) => (
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
							color={'rgba(236, 236, 236, 0.87)'}
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
