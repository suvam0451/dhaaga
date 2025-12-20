import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { AppIcon } from '#/components/lib/Icon';
import ChristmasBellOutline from '#/skins/christmas/navbar/ChristmasBellOutline';
import ChristmasBellFilledOutline from '#/skins/christmas/navbar/ChristmasBellFilledOutline';
import ChristmasScarfFilledOutline from '#/skins/christmas/navbar/ChristmasScarfFilledOutline';
import ChristmasScarfOutline from '#/skins/christmas/navbar/ChristmasScarfOutline';
import ChristmasTeapotFilledOutline from '#/skins/christmas/navbar/ChristmasTeapotFilledOutline';
import ChristmasTeapotOutline from '#/skins/christmas/navbar/ChristmasTeapotOutline';
import ChristmasMufflersFilledOutline from '#/skins/christmas/navbar/ChristmasMufflersFilledOutline';
import ChristmasMufflersOutline from '#/skins/christmas/navbar/ChristmasMufflersOutline';
import ChristmasGiftBoxFilledOutline from '#/skins/christmas/icons/ChristmasGiftBoxFilledOutline';
import ChristmasGiftBoxOutline from '#/skins/christmas/icons/ChristmasGiftBoxOutline';
import ChristmasReindeerOutline from '#/skins/christmas/icons/ChristmasReindeerOutline';
import ChristmasReindeerFilledOutline from '#/skins/christmas/icons/ChristmasReindeerFilledOutline';
import ChristmasMessage from '#/skins/christmas/icons/ChristmasMessage';
import ChristmasGlovesOutline from '#/skins/christmas/icons/ChristmasGlovesOutline';
import ChristmasGlovesFilledOutline from '#/skins/christmas/icons/ChristmasGlovesFilledOutline';

export enum DHAAGA_SKINNED_ICON_ID {
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

const WINTER_THEME_NAVBAR_ICON_ADJUSTMENT = 6;

type DhaagaSkinnedIconProps = {
	id: DHAAGA_SKINNED_ICON_ID;
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
	const { theme, skin } = useAppTheme();
	const ACTIVE_TINT = theme.primary;
	const INACTIVE_TINT = theme.secondary.a40;
	switch (id) {
		case DHAAGA_SKINNED_ICON_ID.BOOKMARK_MENU_ACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{ height: ACTION_BUTTON_SIZE, width: ACTION_BUTTON_SIZE }}
						>
							<ChristmasGlovesFilledOutline color={ACTIVE_TINT} />
						</View>
					);
				default:
					return (
						<Ionicons
							name="bookmarks"
							size={ACTION_BUTTON_SIZE}
							color={ACTIVE_TINT}
						/>
					);
			}
		}
		case DHAAGA_SKINNED_ICON_ID.BOOKMARK_MENU_INACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{ height: ACTION_BUTTON_SIZE, width: ACTION_BUTTON_SIZE }}
						>
							<ChristmasGlovesOutline color={INACTIVE_TINT} />
						</View>
					);
				default:
					return (
						<AppIcon
							id="bookmarks-outline"
							size={ACTION_BUTTON_SIZE}
							color={INACTIVE_TINT}
						/>
					);
			}
		}
		case DHAAGA_SKINNED_ICON_ID.LIKE_INDICATOR_ACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{ width: ACTION_BUTTON_SIZE, height: ACTION_BUTTON_SIZE }}
						>
							<ChristmasGiftBoxFilledOutline size={size} color={ACTIVE_TINT} />
						</View>
					);
				default:
					return (
						<AppIcon
							id={'heart'}
							color={ACTIVE_TINT}
							size={ACTION_BUTTON_SIZE}
						/>
					);
			}
		}
		case DHAAGA_SKINNED_ICON_ID.LIKE_INDICATOR_INACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{ width: ACTION_BUTTON_SIZE, height: ACTION_BUTTON_SIZE }}
						>
							<ChristmasGiftBoxOutline color={INACTIVE_TINT} />
						</View>
					);
				default:
					return (
						<AppIcon
							id={'heart-outline'}
							color={INACTIVE_TINT}
							size={ACTION_BUTTON_SIZE}
						/>
					);
			}
		}
		case DHAAGA_SKINNED_ICON_ID.POST_REPLY_BUTTON: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{
								width: ACTION_BUTTON_SIZE + 4,
								height: ACTION_BUTTON_SIZE + 4,
								marginBottom: -6,
							}}
						>
							<ChristmasMessage color={INACTIVE_TINT} />
						</View>
					);
				default:
					return (
						<AppIcon
							id={'chatbox-outline'}
							color={INACTIVE_TINT}
							size={ACTION_BUTTON_SIZE}
						/>
					);
			}
		}
		case DHAAGA_SKINNED_ICON_ID.POST_SHARE_BUTTON_ACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<ChristmasReindeerFilledOutline size={ACTION_BUTTON_SIZE + 2} />
					);
				default:
					return (
						<AppIcon
							id={'sync-outline'}
							color={ACTIVE_TINT}
							size={ACTION_BUTTON_SIZE}
						/>
					);
			}
		}
		case DHAAGA_SKINNED_ICON_ID.POST_SHARE_BUTTON_INACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<ChristmasReindeerOutline
							size={ACTION_BUTTON_SIZE + 2}
							color={INACTIVE_TINT}
						/>
					);
				default:
					return (
						<AppIcon
							id={'sync-outline'}
							color={INACTIVE_TINT}
							size={ACTION_BUTTON_SIZE}
						/>
					);
			}
		}
		case DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_HUB_ACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{
								width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
								height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
							}}
						>
							<ChristmasTeapotFilledOutline size={size} color={color} />
						</View>
					);
				default:
					return <Ionicons name="map" size={size} color={color} />;
			}
		}
		case DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_HUB_INACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{
								width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
								height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
							}}
						>
							<ChristmasTeapotOutline size={size} color={color} />
						</View>
					);
				default:
					return <Ionicons name="map-outline" size={size} color={color} />;
			}
		}
		case DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_FEED_ACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{
								width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
								height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
							}}
						>
							<ChristmasMufflersFilledOutline size={size} color={color} />
						</View>
					);
				default:
					return <Ionicons name="newspaper" size={size} color={color} />;
			}
		}
		case DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_FEED_INACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{
								width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
								height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
							}}
						>
							<ChristmasMufflersOutline size={size} color={color} />
						</View>
					);
				default:
					return (
						<Ionicons name="newspaper-outline" size={size} color={color} />
					);
			}
		}
		case DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_EXPLORE_ACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return <ChristmasScarfFilledOutline size={size} color={color} />;
				default:
					return <Ionicons name="compass" size={size} color={color} />;
			}
		}
		case DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_EXPLORE_INACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return <ChristmasScarfOutline size={size} color={color} />;
				default:
					return <Ionicons name="compass-outline" size={size} color={color} />;
			}
		}
		case DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_INBOX_ACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{
								width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
								height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
							}}
						>
							<ChristmasBellFilledOutline size={size} color={color} />
						</View>
					);
				default:
					return <Ionicons name="file-tray" size={size} color={color} />;
			}
		}
		case DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_INBOX_INACTIVE: {
			switch (skin) {
				case 'winter':
				case 'christmas':
					return (
						<View
							style={{
								width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
								height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
							}}
						>
							<ChristmasBellOutline size={size} color={color} />
						</View>
					);
				default:
					return (
						<Ionicons name="file-tray-outline" size={size} color={color} />
					);
			}
		}
		default:
			return <View />;
	}
}

export default DhaagaSkinnedIcon;
