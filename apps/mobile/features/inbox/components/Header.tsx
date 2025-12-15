import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { NativeTextH1 } from '#/ui/NativeText';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import {
	TOP_NAVBAR_BOTTOM_PADDING,
	TOP_NAVBAR_MENU_ICON_SIZE,
	TOP_NAVBAR_TOP_PADDING,
} from '#/components/shared/topnavbar/settings';
import { View, StyleSheet, Pressable } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { APP_FONTS } from '#/styles/AppFonts';

type Props = {
	label: string;
	searchTerm?: string | null;
	type: 'mentions' | 'chats' | 'social' | 'updates' | 'replies';
};

function Header({ label, type, searchTerm }: Props) {
	let menuItems = [
		{
			iconId: 'user-guide',
			onPress: () => {
				router.navigate(APP_ROUTING_ENUM.INBOX_GUIDE);
			},
			disabled: false,
		},
	];
	if (type === 'chats') {
		menuItems = [
			{
				iconId: 'add',
				onPress: () => {},
				disabled: false,
			},
			...menuItems,
		];
	}
	if (type === 'updates') {
		menuItems = [
			{
				iconId: 'notifications-outline',
				onPress: () => {
					router.navigate(APP_ROUTING_ENUM.INBOX_MANAGE_SUBSCRIPTIONS);
				},
				disabled: false,
			},
			...menuItems,
		];
	}
	return (
		<View style={[styles.root]}>
			<View style={{ flexDirection: 'row' }}>
				<NativeTextH1 style={{ flex: 1, marginTop: 16 }}>{label}</NativeTextH1>
				<View style={{ flexDirection: 'row' }}>
					{menuItems.map(({ iconId, disabled, onPress }, i) => (
						<Pressable key={i} style={styles.menuButton} onPress={onPress}>
							<AppIcon
								id={iconId as any}
								emphasis={
									disabled
										? APP_COLOR_PALETTE_EMPHASIS.A40
										: APP_COLOR_PALETTE_EMPHASIS.A10
								}
								onPress={onPress}
								size={TOP_NAVBAR_MENU_ICON_SIZE}
							/>
						</Pressable>
					))}
				</View>
			</View>
		</View>
	);
}

export default Header;

const styles = StyleSheet.create({
	root: {
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		height: appDimensions.topNavbar.hubVariantHeight,
	},
	menuButton: {
		padding: appDimensions.topNavbar.padding,
		marginLeft: appDimensions.topNavbar.marginLeft,
		paddingTop: TOP_NAVBAR_TOP_PADDING,
		paddingBottom: TOP_NAVBAR_BOTTOM_PADDING,
	},
});
