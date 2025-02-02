import { Pressable, StyleSheet, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_ICON_ENUM, AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppText } from '../../lib/Text';
import { appDimensions } from '../../../styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

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
	ACCOUNT_HUB,
}

type AppTabLandingNavbarProps = {
	type: APP_LANDING_PAGE_TYPE;
	menuItems: {
		iconId: APP_ICON_ENUM;
		onPress?: () => void;
		disabled?: boolean;
	}[];
};

/**
 * This navbar is expected on the
 * landing pages for each of the five
 * main routes
 */
function AppTabLandingNavbar({ type, menuItems }: AppTabLandingNavbarProps) {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const navbarLabel: Record<APP_LANDING_PAGE_TYPE, string> = {
		[APP_LANDING_PAGE_TYPE.SOCIAL_HUB_ADD_TAB]: 'Add Profile',
		[APP_LANDING_PAGE_TYPE.HOME]: t(`topNav.primary.hub`),
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
	};

	return (
		<View style={[styles.container]}>
			<View style={{ flexGrow: 1 }}>
				<AppText.H1>{navbarLabel[type]}</AppText.H1>
			</View>
			<View style={{ flexDirection: 'row' }}>
				{menuItems.map(({ iconId, disabled, onPress }, i) => (
					<Pressable
						key={i}
						style={{
							padding: appDimensions.topNavbar.padding,
							marginLeft: appDimensions.topNavbar.marginLeft,
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
		fontFamily: APP_FONTS.INTER_700_BOLD, // fontWeight: '600',
	},
});
