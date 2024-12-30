import { Pressable, StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_ICON_ENUM, AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

export enum APP_LANDING_PAGE_TYPE {
	HOME,
	SOCIAL_HUB_ADD_TAB,
	DISCOVER,
	COMPOSE,
	INBOX,
	PROFILE,

	// Modules within "Inbox" tab
	MENTIONS,
	CHAT,
	SOCIAL,
	UPDATES,
	APP_SETTINGS,
	MY_ACCOUNT,
	MY_PROFILE,
}

type AppTabLandingNavbarProps = {
	type: APP_LANDING_PAGE_TYPE;
	menuItems: {
		iconId: APP_ICON_ENUM;
		onPress?: () => void;
		disabled?: boolean;
	}[];
};

const navbarLabel: Record<APP_LANDING_PAGE_TYPE, string> = {
	[APP_LANDING_PAGE_TYPE.SOCIAL_HUB_ADD_TAB]: 'Add Account',
	[APP_LANDING_PAGE_TYPE.HOME]: 'Social Hub',
	[APP_LANDING_PAGE_TYPE.DISCOVER]: 'Discover',
	[APP_LANDING_PAGE_TYPE.COMPOSE]: 'Compose',
	[APP_LANDING_PAGE_TYPE.INBOX]: 'Inbox',
	[APP_LANDING_PAGE_TYPE.PROFILE]: 'App Profile',
	// Modules within "Inbox" tab
	[APP_LANDING_PAGE_TYPE.MENTIONS]: 'Mentions',
	[APP_LANDING_PAGE_TYPE.CHAT]: 'Chat',
	[APP_LANDING_PAGE_TYPE.SOCIAL]: 'Social',
	[APP_LANDING_PAGE_TYPE.UPDATES]: 'Updates',
	[APP_LANDING_PAGE_TYPE.APP_SETTINGS]: 'App Settings',
	[APP_LANDING_PAGE_TYPE.MY_ACCOUNT]: 'My Account',
	[APP_LANDING_PAGE_TYPE.MY_PROFILE]: 'My Profile',
};

/**
 * This navbar is expected on the
 * landing pages for each of the five
 * main routes
 */
function AppTabLandingNavbar({ type, menuItems }: AppTabLandingNavbarProps) {
	const { theme } = useAppTheme();

	return (
		<View style={[styles.container]}>
			<View style={{ flexGrow: 1 }}>
				<Text style={[styles.headerText, { color: theme.secondary.a0 }]}>
					{navbarLabel[type]}
				</Text>
			</View>
			<View style={{ flexDirection: 'row' }}>
				{menuItems.map(({ iconId, disabled, onPress }, i) => (
					<Pressable
						key={i}
						style={{ padding: 4, marginLeft: 4 }}
						onPress={onPress}
					>
						<AppIcon
							id={iconId}
							emphasis={
								disabled
									? APP_COLOR_PALETTE_EMPHASIS.A40
									: APP_COLOR_PALETTE_EMPHASIS.A20
							}
							onPress={onPress}
						/>
					</Pressable>
				))}
			</View>
		</View>
	);
}

export default AppTabLandingNavbar;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		paddingVertical: 16,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
});
