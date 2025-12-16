import { Pressable, StyleSheet, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import APP_ICON_ENUM, { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { appDimensions } from '#/styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import {
	TOP_NAVBAR_BOTTOM_PADDING,
	TOP_NAVBAR_MENU_ICON_SIZE,
	TOP_NAVBAR_TOP_PADDING,
} from '#/components/shared/topnavbar/settings';
import { NativeTextH1 } from '#/ui/NativeText';

export enum APP_LANDING_PAGE_TYPE {
	HOME,
	HUB,
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
	ACCOUNT_HUB,
	ALL_ACCOUNTS,
}

type AppTabLandingNavbarProps = {
	type: APP_LANDING_PAGE_TYPE;
	menuItems: {
		iconId: APP_ICON_ENUM;
		onPress?: () => void;
		disabled?: boolean;
	}[];
	hasDropdown?: boolean;
	dropdownSelectedId?: string;
	dropdownItems?: { id: string; label: string; onSelect: () => void }[];
};

/**
 * This navbar is expected on the
 * landing pages for each of the five
 * main routes
 */
function AppTabLandingNavbar({
	type,
	menuItems,
	hasDropdown,
	dropdownSelectedId,
	dropdownItems,
}: AppTabLandingNavbarProps) {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const navbarLabel: Record<APP_LANDING_PAGE_TYPE, string> = {
		[APP_LANDING_PAGE_TYPE.HOME]: 'Home',
		[APP_LANDING_PAGE_TYPE.SOCIAL_HUB_ADD_TAB]: 'Add Profile',
		[APP_LANDING_PAGE_TYPE.HUB]: t(`topNav.primary.hub`),
		[APP_LANDING_PAGE_TYPE.DISCOVER]: t(`topNav.primary.discover`),
		[APP_LANDING_PAGE_TYPE.COMPOSE]: t(`topNav.primary.compose`),
		[APP_LANDING_PAGE_TYPE.INBOX]: t(`topNav.primary.inbox`),
		[APP_LANDING_PAGE_TYPE.PROFILE]: 'App Profile', // Modules within "Inbox" tab
		[APP_LANDING_PAGE_TYPE.MENTIONS]: t(`topNav.primary.mentions`),
		[APP_LANDING_PAGE_TYPE.CHAT]: t(`topNav.primary.chat`),
		[APP_LANDING_PAGE_TYPE.SOCIAL]: t(`topNav.primary.social`),
		[APP_LANDING_PAGE_TYPE.UPDATES]: t(`topNav.primary.updates`),
		[APP_LANDING_PAGE_TYPE.APP_SETTINGS]: t(`topNav.secondary.appSettings`),
		[APP_LANDING_PAGE_TYPE.MY_ACCOUNT]: t(`topNav.secondary.myAccount`),
		[APP_LANDING_PAGE_TYPE.MY_PROFILE]: t(`topNav.secondary.myProfile`),
		[APP_LANDING_PAGE_TYPE.ACCOUNT_HUB]: t(`topNav.secondary.myAccount`),
		[APP_LANDING_PAGE_TYPE.ALL_ACCOUNTS]: 'My Accounts',
	};

	const NAVBAR_LABEL = hasDropdown
		? dropdownItems.find((i) => i.id === dropdownSelectedId)?.label
		: navbarLabel[type];

	return (
		<View style={[styles.container]}>
			<View style={{ flexDirection: 'row' }}>
				<NativeTextH1 style={{ flex: 1, marginTop: 16 }}>
					{NAVBAR_LABEL}
				</NativeTextH1>
				<View style={{ flexDirection: 'row' }}>
					{menuItems.map(({ iconId, disabled, onPress }, i) => (
						<Pressable key={i} style={styles.menuButton} onPress={onPress}>
							<AppIcon
								id={iconId}
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

export default AppTabLandingNavbar;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		width: '100%',
		zIndex: 1,
		marginBottom: 16,
		height: appDimensions.topNavbar.hubVariantHeight,
	},
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD, // fontWeight: '600',
	},
	labelArea: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'relative',
		flexGrow: 1,
		paddingVertical: TOP_NAVBAR_TOP_PADDING,
	},
	menuButton: {
		padding: appDimensions.topNavbar.padding,
		marginLeft: appDimensions.topNavbar.marginLeft,
		paddingTop: TOP_NAVBAR_TOP_PADDING,
		paddingBottom: TOP_NAVBAR_BOTTOM_PADDING,
	},
});
