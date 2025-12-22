import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { ChristmasPack } from './LicensedSvgs';
import { AppIcon } from '#/components/lib/Icon';
import { StyleProp, View, ViewStyle } from 'react-native';

enum APP_ICON_IDENTIFIER {
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

interface IconMappingEntry {
	(props: { size: number; color: string; skinId: string }): ReactNode;
}

type SUPPORTED_ICON_PACKS = 'christmas';

const SKIN_TO_PACK_RECORD: Record<string, SUPPORTED_ICON_PACKS> = {
	christmas: 'christmas',
};

type ReturnType = (props: {
	size: number;
	color: string;
	skinId: string;
}) => ReactNode;

function themedIconFactory(
	defaultSet: ({ size, color }) => ReactNode,
	themedSet: Record<SUPPORTED_ICON_PACKS, React.ComponentType<any>> = null,
	style: ({ size }) => StyleProp<ViewStyle> = null,
): ReturnType {
	return ({
		size,
		color,
		skinId,
	}: {
		size: number;
		color: string;
		skinId: string;
	}) => {
		const ThemedSvg = themedSet[SKIN_TO_PACK_RECORD[skinId]];
		if (!ThemedSvg) return defaultSet({ size, color });
		return (
			<View
				style={
					style
						? style({ size })
						: {
								width: size,
								height: size,
							}
				}
			>
				<ThemedSvg size={size} color={color} />
			</View>
		);
	};
}

const WINTER_THEME_NAVBAR_ICON_ADJUSTMENT = 6;

const LicensedSvgMapper: Record<APP_ICON_IDENTIFIER, IconMappingEntry> = {
	[APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_HUB_ACTIVE]: themedIconFactory(
		({ size, color }) => <Ionicons name="map" size={size} color={color} />,
		{
			christmas: ChristmasPack.ChristmasTeapotFilledOutline,
		},
		({ size }) => ({
			width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
			height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
		}),
	),
	[APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_HUB_INACTIVE]: themedIconFactory(
		({ size, color }) => (
			<Ionicons name="map-outline" size={size} color={color} />
		),
		{
			christmas: ChristmasPack.ChristmasTeapotOutline,
		},
		({ size }) => ({
			width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
			height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
		}),
	),
	[APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_FEED_ACTIVE]: themedIconFactory(
		({ size, color }) => (
			<Ionicons name="newspaper" size={size} color={color} />
		),
		{
			christmas: ChristmasPack.ChristmasMufflersFilledOutline,
		},
		({ size }) => ({
			width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
			height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
		}),
	),
	[APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_FEED_INACTIVE]: themedIconFactory(
		({ size, color }) => (
			<Ionicons name="newspaper-outline" size={size} color={color} />
		),
		{
			christmas: ChristmasPack.ChristmasMufflersOutline,
		},
		({ size }) => ({
			width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
			height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
		}),
	),
	[APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_EXPLORE_ACTIVE]: themedIconFactory(
		({ size, color }) => <Ionicons name="compass" size={size} color={color} />,
		{
			christmas: ChristmasPack.ChristmasScarfFilledOutline,
		},
		({ size }) => ({
			width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
			height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
		}),
	),
	[APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_EXPLORE_INACTIVE]: themedIconFactory(
		({ size, color }) => (
			<Ionicons name="compass-outline" size={size} color={color} />
		),
		{
			christmas: ChristmasPack.ChristmasScarfOutline,
		},
		({ size }) => ({
			width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
			height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
		}),
	),
	[APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_INBOX_ACTIVE]: themedIconFactory(
		({ size, color }) => (
			<Ionicons name="file-tray" size={size} color={color} />
		),
		{
			christmas: ChristmasPack.ChristmasBellFilledOutline,
		},
		({ size }) => ({
			width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
			height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
		}),
	),
	[APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_INBOX_INACTIVE]: themedIconFactory(
		({ size, color }) => (
			<Ionicons name="file-tray" size={size} color={color} />
		),
		{
			christmas: ChristmasPack.ChristmasBellOutline,
		},
		({ size }) => ({
			width: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
			height: size + WINTER_THEME_NAVBAR_ICON_ADJUSTMENT,
		}),
	),
	[APP_ICON_IDENTIFIER.BOOKMARK_MENU_ACTIVE]: themedIconFactory(
		({ size, color }) => (
			<Ionicons name="bookmarks" size={size} color={color} />
		),
		{
			christmas: ChristmasPack.ChristmasGlovesFilledOutline,
		},
	),
	[APP_ICON_IDENTIFIER.BOOKMARK_MENU_INACTIVE]: themedIconFactory(
		({ size, color }) => (
			<AppIcon id="bookmarks-outline" size={size} color={color} />
		),
		{
			christmas: ChristmasPack.ChristmasGlovesOutline,
		},
	),
	[APP_ICON_IDENTIFIER.LIKE_INDICATOR_ACTIVE]: themedIconFactory(
		({ size, color }) => <AppIcon id={'heart'} color={color} size={size} />,
		{
			christmas: ChristmasPack.ChristmasGiftBoxFilledOutline,
		},
	),
	[APP_ICON_IDENTIFIER.LIKE_INDICATOR_INACTIVE]: themedIconFactory(
		({ size, color }) => (
			<AppIcon id={'heart-outline'} color={color} size={size} />
		),
		{
			christmas: ChristmasPack.ChristmasGiftBoxOutline,
		},
	),
	[APP_ICON_IDENTIFIER.POST_SHARE_BUTTON_ACTIVE]: themedIconFactory(
		({ size, color }) => (
			<AppIcon id={'sync-outline'} color={color} size={size} />
		),
		{
			christmas: ChristmasPack.ChristmasReindeerFilledOutline,
		},
	),
	[APP_ICON_IDENTIFIER.POST_SHARE_BUTTON_INACTIVE]: themedIconFactory(
		({ size, color }) => (
			<AppIcon id={'sync-outline'} color={color} size={size} />
		),
		{
			christmas: ChristmasPack.ChristmasReindeerOutline,
		},
	),
	[APP_ICON_IDENTIFIER.POST_REPLY_BUTTON]: themedIconFactory(
		({ size, color }) => (
			<AppIcon id={'chatbox-outline'} color={color} size={size} />
		),
		{
			christmas: ChristmasPack.ChristmasMessage,
		},
		({ size }) => ({
			width: size + 4,
			height: size + 4,
			marginBottom: -6,
		}),
	),
};

export default LicensedSvgMapper;
