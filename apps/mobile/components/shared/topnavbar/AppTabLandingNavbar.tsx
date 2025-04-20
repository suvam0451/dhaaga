import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_ICON_ENUM, AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppText } from '../../lib/Text';
import { appDimensions } from '../../../styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

export enum APP_LANDING_PAGE_TYPE {
	HOME,
	SOCIAL_HUB_ADD_TAB,
	DISCOVER,
	COMPOSE,
	INBOX,
	PROFILE,

	/**
	 * Search Modules
	 */
	SEARCH_HOME,
	SEARCH_POSTS,
	SEARCH_USERS,
	SEARCH_FEEDS,
	SEARCH_LINKS,
	SEARCH_TAGS,
	SEARCH_FAVOURITES,
	SEARCH_HISTORY,

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
	/**
	 * adds a dropdown arrow and makes
	 * press interaction possible
	 */
	isLabelTextInteractable?: boolean;
	onLabelTextPress?: () => void;
};

/**
 * This navbar is expected on the
 * landing pages for each of the five
 * main routes
 */
function AppTabLandingNavbar({
	type,
	menuItems,
	isLabelTextInteractable,
	onLabelTextPress,
}: AppTabLandingNavbarProps) {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { theme } = useAppTheme();
	const navbarLabel: Record<APP_LANDING_PAGE_TYPE, string> = {
		[APP_LANDING_PAGE_TYPE.SOCIAL_HUB_ADD_TAB]: 'Add Profile',
		[APP_LANDING_PAGE_TYPE.HOME]: t(`topNav.primary.hub`),
		/**
		 * Search Module
		 */
		[APP_LANDING_PAGE_TYPE.SEARCH_HOME]: 'Home',
		[APP_LANDING_PAGE_TYPE.SEARCH_POSTS]: 'Posts',
		[APP_LANDING_PAGE_TYPE.SEARCH_USERS]: 'Users',
		[APP_LANDING_PAGE_TYPE.SEARCH_FEEDS]: 'Feeds',
		[APP_LANDING_PAGE_TYPE.SEARCH_LINKS]: 'Links',
		[APP_LANDING_PAGE_TYPE.SEARCH_TAGS]: 'Tags',
		[APP_LANDING_PAGE_TYPE.SEARCH_FAVOURITES]: 'Favourites',
		[APP_LANDING_PAGE_TYPE.SEARCH_HISTORY]: 'History',

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

	function onLabelTextPressHandler() {
		if (isLabelTextInteractable && onLabelTextPress) {
			onLabelTextPress();
		}
	}

	return (
		<View style={[styles.container]}>
			<TouchableOpacity
				style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center' }}
				onPress={onLabelTextPressHandler}
			>
				<AppText.H1>{navbarLabel[type]}</AppText.H1>
				{isLabelTextInteractable && (
					<View
						style={{
							marginLeft: 6,
							alignItems: 'center',
						}}
					>
						<Ionicons
							name={'chevron-down'}
							color={theme.primary.a0}
							size={20}
							style={{ alignSelf: 'center' }}
						/>
					</View>
				)}
			</TouchableOpacity>
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
