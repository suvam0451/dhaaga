import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import LicensedSvgMapper from '#/features/skins/components/LicensedSvgMapper';

export enum APP_ICON_IDENTIFIER {
	BOOKMARK_MENU_ACTIVE = 'bookmark-menu-active',
	BOOKMARK_MENU_INACTIVE = 'bookmark-menu-inactive',

	LIKE_INDICATOR_ACTIVE = 'like-indicator-active',
	LIKE_INDICATOR_INACTIVE = 'like-indicator-inactive',
	POST_REPLY_BUTTON = 'post-reply-button',

	POST_SHARE_BUTTON_ACTIVE = 'share-button-active',
	POST_SHARE_BUTTON_INACTIVE = 'share-button-inactive',

	BOTTOM_NAVBAR_HUB_ACTIVE = 'bottom-navbar-hub-active',
	BOTTOM_NAVBAR_HUB_INACTIVE = 'bottom-navbar-hub-inactive',

	BOTTOM_NAVBAR_FEED_ACTIVE = 'bottom-navbar-feed-active',
	BOTTOM_NAVBAR_FEED_INACTIVE = 'bottom-navbar-feed-inactive',

	BOTTOM_NAVBAR_EXPLORE_ACTIVE = 'bottom-navbar-explore-active',
	BOTTOM_NAVBAR_EXPLORE_INACTIVE = 'bottom-navbar-explore-inactive',

	BOTTOM_NAVBAR_INBOX_ACTIVE = 'bottom-navbar-inbox-active',
	BOTTOM_NAVBAR_INBOX_INACTIVE = 'bottom-navbar-inbox-inactive',
}

type DhaagaSkinnedIconProps = {
	id: APP_ICON_IDENTIFIER;
	emphasis?: APP_COLOR_PALETTE_EMPHASIS;
	iconStyle?: StyleProp<TextStyle>;
	containerStyle?: StyleProp<ViewStyle>;
	size?: number;
	onPress?: () => void;
	icon?: string;
	color?: string;
};

const ACTION_BUTTON_SIZE = appDimensions.timelines.actionButtonSize;

function DhaagaSkinnedIcon({ id, size, color }: DhaagaSkinnedIconProps) {
	const { theme } = useAppTheme();
	const ACTIVE_TINT = theme.primary;
	const INACTIVE_TINT = theme.secondary.a40;
	switch (id) {
		case APP_ICON_IDENTIFIER.BOOKMARK_MENU_ACTIVE:
		case APP_ICON_IDENTIFIER.LIKE_INDICATOR_ACTIVE:
		case APP_ICON_IDENTIFIER.POST_SHARE_BUTTON_ACTIVE: {
			return LicensedSvgMapper[id].call({
				size: ACTION_BUTTON_SIZE,
				color: ACTIVE_TINT,
				skinId: theme.id,
			});
		}
		case APP_ICON_IDENTIFIER.BOOKMARK_MENU_INACTIVE:
		case APP_ICON_IDENTIFIER.LIKE_INDICATOR_INACTIVE:
		case APP_ICON_IDENTIFIER.POST_SHARE_BUTTON_INACTIVE: {
			return LicensedSvgMapper[id]({
				size: ACTION_BUTTON_SIZE,
				color: INACTIVE_TINT,
				skinId: theme.id,
			});
		}
		case APP_ICON_IDENTIFIER.POST_REPLY_BUTTON: {
			return LicensedSvgMapper[id]({
				size: ACTION_BUTTON_SIZE,
				color: INACTIVE_TINT,
				skinId: theme.id,
			});
		}
		case APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_HUB_ACTIVE:
		case APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_HUB_INACTIVE:
		case APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_FEED_ACTIVE:
		case APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_FEED_INACTIVE:
		case APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_EXPLORE_ACTIVE:
		case APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_EXPLORE_INACTIVE:
		case APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_INBOX_ACTIVE:
		case APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_INBOX_INACTIVE: {
			return LicensedSvgMapper[id]({
				size,
				color,
				skinId: theme.id,
			});
		}
		default:
			return <View />;
	}
}

export default DhaagaSkinnedIcon;
