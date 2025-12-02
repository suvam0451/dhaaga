import { Pressable, StyleSheet, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_ICON_ENUM, AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppText } from '../../lib/Text';
import { appDimensions } from '../../../styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import { Ionicons } from '@expo/vector-icons';
import Dropdown from '#/components/shared/topnavbar/Dropdown';
import { useState } from 'react';

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
};

/**
 * This navbar is expected on the
 * landing pages for each of the five
 * main routes
 */
function AppTabLandingNavbar({ type, menuItems }: AppTabLandingNavbarProps) {
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

	const [DropdownOpen, setDropdownOpen] = useState(false);

	function toggleDropdown() {
		setDropdownOpen((o) => !o);
	}
	return (
		<View style={[styles.container]}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ flexGrow: 1 }}>
					<Pressable
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							position: 'relative',
							// zIndex: 99,
						}}
						onPress={toggleDropdown}
					>
						<View
							style={{
								position: 'relative',
								height: '100%',
								backgroundColor: 'red',
							}}
						></View>
						<AppText.H1>{navbarLabel[type]}</AppText.H1>
						<Ionicons
							name="chevron-down"
							style={{ marginLeft: 6, paddingTop: 4 }}
							size={24}
							color={'white'}
						/>
					</Pressable>
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
			<Dropdown
				isOpen={DropdownOpen}
				items={[{ label: 'All' }, { label: 'Posts' }, { label: 'Users' }]}
			/>
		</View>
	);
}

export default AppTabLandingNavbar;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		paddingVertical: 16,
		alignItems: 'center',
		width: '100%',
		zIndex: 2000,
	},
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD, // fontWeight: '600',
	},
});
