import { useMemo } from 'react';
import {
	Pressable,
	StyleProp,
	StyleSheet,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import {
	useActiveUserSession,
	useAppBottomSheet,
	useAppTheme,
} from '../../states/global/hooks';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type APP_ICON_ENUM =
	| 'add'
	| 'add-circle-outline'
	| 'albums-outline'
	| 'apps-outline'
	| 'arrow-redo-outline'
	| 'bell'
	| 'back'
	| 'bookmark'
	| 'bookmark-outline'
	| 'bookmarks'
	| 'bookmarks-outline'
	| 'block'
	| 'browser'
	| 'cog'
	| 'chatbox-outline'
	| 'chat-ellipses-outline'
	| 'chatbubbles-outline'
	| 'chatbubble-ellipses-outline'
	| 'checkbox'
	| 'checkmark'
	| 'checkmark-circle'
	| 'checkmark-done-outline'
	| 'chevron-left'
	| 'chevron-right'
	| 'chevron-down'
	| 'chevron-down-circle'
	| 'chevron-collapse-outline'
	| 'chevron-expand-outline'
	| 'cloud-upload-outline'
	| 'close'
	| 'close-outline'
	| 'settings'
	| 'settings-outline'
	| 'copy'
	| 'create'
	| 'clear'
	| 'done'
	| 'edit'
	| 'ellipsis-v'
	| 'external-link'
	| 'eye'
	| 'eye-filled'
	| 'eye-off-filled'
	| 'filter-outline'
	| 'flash'
	| 'funnel-outline'
	| 'gallery'
	| 'globe'
	| 'grid-outline'
	| 'heart'
	| 'heart-outline'
	| 'home'
	| 'images'
	| 'images-outline'
	| 'info'
	| 'language'
	| 'layers-outline'
	| 'link-outline'
	| 'list'
	| 'lock-closed-outline'
	| 'megaphone-outline'
	| 'menu'
	| 'message'
	| 'more-options-vertical'
	| 'musical-notes-outline'
	| 'newspaper'
	| 'notifications-outline'
	| 'no-account'
	| 'palette'
	| 'person-add'
	| 'person-outline'
	| 'people'
	| 'phonebook'
	| 'pin'
	| 'pin-octicons'
	| 'quote'
	| 'retweet'
	| 'save'
	| 'server-outline'
	| 'search'
	| 'send'
	| 'share'
	| 'feelings'
	| 'smiley'
	| 'smiley-outline'
	| 'sync-outline'
	| 'time-outline'
	| 'to-top'
	| 'trash'
	| 'user-guide'
	| 'wand'
	| 'warning-outline'
	| 'mute-outline'
	| 'unmute-outline';
export default APP_ICON_ENUM;

type AppIconType = {
	id: APP_ICON_ENUM;
	emphasis?: APP_COLOR_PALETTE_EMPHASIS;
	iconStyle?: StyleProp<TextStyle>;
	containerStyle?: StyleProp<ViewStyle>;
	size?: number;
	onPress?: () => void;
	icon?: string;
	color?: string;
};

/**
 * === Navigation Icons ===
 */

type NavigationIconType = {
	color: string;
	size: number;
	focused: boolean;
	sizeOffset: number;
};

/**
 *	The navigation icon for the home tab.
 *
 * 	Long presses sends the user back to home
 * 	and resets the home tab
 */
export function HomeNavigationIcon({
	focused,
	color,
	size,
	sizeOffset,
}: NavigationIconType) {
	function onPress() {
		router.navigate('/');
	}

	function onLongPress(e: any) {
		e.preventDefault();
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		router.navigate('/');
	}

	return (
		<TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
			{focused ? (
				<Ionicons size={size + sizeOffset} name="home" color={color} />
			) : (
				<Ionicons size={size + sizeOffset} name="home-outline" color={color} />
			)}
		</TouchableOpacity>
	);
}

export function NavbarButtonDefault({ onPress, onLongPress, children }: any) {
	function onLongPressAction(e: any) {
		onLongPress();
	}

	function onPressAction(e: any) {
		onPress();
	}
	return (
		<Pressable
			style={{
				marginVertical: 'auto',
			}}
			onPress={onPressAction}
			onLongPress={onLongPressAction}
		>
			<View
				style={{
					marginHorizontal: 'auto',
					marginVertical: 'auto',
				}}
			>
				{children}
			</View>
		</Pressable>
	);
}
/**
 * A custom navigation button container,
 * which prevents the user from interacting with the
 * button when they are signed out.
 * @param onPress
 * @param onLongPress
 * @param children
 * @param alwaysEnabled will never disable the button
 * @constructor
 */
export function NavbarButtonDisabledOnSignOut({
	onPress,
	onLongPress,
	children,
}: any) {
	const { acct } = useActiveUserSession();

	function onLongPressAction(e: any) {
		if (!acct) return;
		onLongPress();
	}

	function onPressAction(e: any) {
		if (!acct) return;
		onPress();
	}
	return (
		<Pressable
			style={{
				marginVertical: 'auto',
			}}
			onPress={onPressAction}
			onLongPress={onLongPressAction}
		>
			<View
				style={{
					marginHorizontal: 'auto',
					marginVertical: 'auto',
				}}
			>
				{children}
			</View>
		</Pressable>
	);
}

export function ProfileTabNavbarIconButton({
	onPress,
	onLongPress,
	children,
}: any) {
	const { show } = useAppBottomSheet();
	const { acct } = useActiveUserSession();

	function onLongPressAction(e: any) {
		e.preventDefault();
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		show(APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT, true);
	}

	function onPressAction(e: any) {
		// router.navigate('/profile');
		// router.dismiss(2);
		onPress();
	}
	return (
		<Pressable onPress={onPressAction} onLongPress={onLongPressAction}>
			<View
				style={{
					marginHorizontal: 'auto',
				}}
			>
				{children}
			</View>
		</Pressable>
	);
}

export function ProfileTabNavbarIcon({
	color,
	size,
	sizeOffset,
}: NavigationIconType) {
	const { theme } = useAppTheme();
	const { acct } = useActiveUserSession();

	if (!acct)
		return (
			<Ionicons name="settings-sharp" size={size + sizeOffset} color={color} />
		);

	return (
		<View style={styles.accountIconTouchableContainer}>
			<View style={styles.accountIconInternalContainer}>
				<Image
					style={{
						width: 38,
						height: 38,
						opacity: 0.92,
						borderRadius: 16,
					}}
					source={{ uri: acct?.avatarUrl }}
					contentFit="fill"
				/>
			</View>
			<View style={{ width: 14 }}>
				<Feather name="more-vertical" size={24} color={theme.secondary.a40} />
			</View>
		</View>
	);
}

export function DiscoverNavigationIcon(props: NavigationIconType) {}

export function AppIcon({
	id,
	emphasis,
	iconStyle,
	size,
	onPress,
	containerStyle,
	color,
}: AppIconType) {
	const { theme } = useAppTheme();

	let _color = null;
	let _size = size || 24;
	if (color) {
		_color = color;
	} else {
		switch (emphasis) {
			case APP_COLOR_PALETTE_EMPHASIS.A0: {
				_color = theme.secondary.a0;
				break;
			}
			case APP_COLOR_PALETTE_EMPHASIS.A10: {
				_color = theme.secondary.a10;
				break;
			}
			case APP_COLOR_PALETTE_EMPHASIS.A20: {
				_color = theme.secondary.a20;
				break;
			}
			case APP_COLOR_PALETTE_EMPHASIS.A30: {
				_color = theme.secondary.a30;
				break;
			}
			case APP_COLOR_PALETTE_EMPHASIS.A40: {
				_color = theme.secondary.a40;
				break;
			}
			case APP_COLOR_PALETTE_EMPHASIS.A50: {
				_color = theme.secondary.a50;
				break;
			}
			default: {
				_color = theme.secondary.a0;
				break;
			}
		}
	}

	const Icon = useMemo(() => {
		switch (id) {
			case 'add':
				return (
					<Ionicons
						name={'add-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'add-circle-outline':
				return (
					<Ionicons
						name={'add-circle-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'albums-outline':
				return (
					<Ionicons
						name={'albums-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'apps-outline':
				return (
					<Ionicons
						name={'apps-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'arrow-redo-outline':
				return (
					<Ionicons
						name="arrow-redo-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'bell':
				return (
					<Ionicons
						name="notifications"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'back':
				return (
					<Ionicons
						name="chevron-back"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'bookmark':
				return (
					<Ionicons
						name="bookmark"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'bookmark-outline':
				return (
					<Ionicons
						name="bookmark-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'bookmarks':
				return (
					<Ionicons
						name="bookmarks"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'bookmarks-outline':
				return (
					<Ionicons
						name="bookmarks-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'block':
				return (
					<Ionicons
						name="ban-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'browser':
				return (
					<Ionicons
						name="browsers-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'cog':
				return (
					<FontAwesome5
						name="cog"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chatbox-outline':
				return (
					<Ionicons
						name={'chatbox-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chat-ellipses-outline':
				return (
					<Ionicons
						name={'chatbox-ellipses-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chatbubbles-outline':
				return (
					<Ionicons
						name={'chatbubbles-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chatbubble-ellipses-outline':
				return (
					<Ionicons
						name={'chatbubble-ellipses-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'checkbox':
				return (
					<Ionicons
						name="checkbox"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'checkmark':
				return (
					<Ionicons
						name={'checkmark'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'checkmark-circle':
				return (
					<Ionicons
						name={'checkmark-circle'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chevron-left':
				return (
					<Entypo
						name="chevron-small-left"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chevron-right':
				return (
					<Entypo
						name="chevron-small-right"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chevron-down':
				return (
					<Ionicons
						name="chevron-down"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chevron-down-circle':
				return (
					<Ionicons
						name="chevron-down-circle"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chevron-collapse-outline':
				return (
					<Ionicons
						name="chevron-collapse-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'chevron-expand-outline':
				return (
					<Ionicons
						name="chevron-expand-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'cloud-upload-outline':
				return (
					<Ionicons
						name={'cloud-upload-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'close':
				return (
					<Ionicons
						name={'close'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'close-outline':
				return (
					<Ionicons
						name={'close-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'checkmark-done-outline':
				return (
					<Ionicons
						name="checkmark-done-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'settings':
				return (
					<Ionicons
						name="settings"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'settings-outline':
				return (
					<Ionicons
						name="settings-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'copy':
				return (
					<Ionicons
						name="copy-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'clear':
				return (
					<Ionicons
						name="close"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'create':
				return (
					<Ionicons
						name="create-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'done':
				return (
					<Ionicons
						name="checkmark-done"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'edit':
				return (
					<Feather name="edit" size={_size} color={_color} style={iconStyle} />
				);

			case 'ellipsis-v':
				return (
					<Ionicons
						name="ellipsis-horizontal"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'external-link':
				return (
					<Feather
						name="external-link"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'eye':
				return (
					<Ionicons
						name="eye-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'eye-filled':
				return (
					<Ionicons name="eye" size={_size} color={_color} style={iconStyle} />
				);
			case 'eye-off-filled':
				return (
					<Ionicons
						name="eye-off"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'filter-outline':
				return (
					<Ionicons
						name={'filter-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'flash':
				return (
					<Ionicons
						name="flash"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'funnel-outline':
				return (
					<Ionicons
						name="funnel-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'gallery':
				return (
					<Ionicons
						name="logo-instagram"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'globe':
				return (
					<Feather name="globe" size={_size} color={_color} style={iconStyle} />
				);
			case 'grid-outline':
				return (
					<Ionicons
						name={'grid-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'heart':
				return (
					<Ionicons
						name={'heart'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'heart-outline':
				return (
					<Ionicons
						name={'heart-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'home':
				return (
					<Ionicons name="home" size={_size} color={_color} style={iconStyle} />
				);
			case 'images':
				return (
					<Ionicons
						name="images"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'images-outline':
				return (
					<Ionicons
						name="images-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'info':
				return (
					<Ionicons
						name="information-circle-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'language':
				return (
					<Ionicons
						name="language"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'layers-outline':
				return (
					<Ionicons
						name={'layers-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'link-outline':
				return (
					<Ionicons
						name="link-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'list':
				return (
					<Ionicons
						name={'list'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'lock-closed-outline':
				return (
					<Ionicons
						name="lock-closed-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'feelings':
				return (
					<FontAwesome6
						name="heart-pulse"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'megaphone-outline':
				return (
					<Ionicons
						name="megaphone-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'menu':
				return (
					<Ionicons name="menu" size={_size} color={_color} style={iconStyle} />
				);
			case 'message':
				return (
					<AntDesign
						name="message"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'more-options-vertical':
				return (
					<Ionicons
						name={'ellipsis-vertical'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'musical-notes-outline':
				return (
					<Ionicons
						name={'musical-notes-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'newspaper':
				return (
					<Ionicons
						name={'newspaper-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'no-account':
				return (
					<MaterialIcons
						name="no-accounts"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'notifications-outline':
				return (
					<Ionicons
						name="notifications-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'palette':
				return (
					<Ionicons
						name="color-palette-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'person-add':
				return (
					<Ionicons
						name="person-add"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'person-outline':
				return (
					<Ionicons
						name={'person-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'people':
				return (
					<Ionicons
						name="people"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'phonebook':
				return (
					<FontAwesome6
						name="contact-book"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'pin':
				return (
					<AntDesign
						name="pushpin"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'pin-octicons':
				return (
					<Octicons name="pin" size={_size} color={_color} style={iconStyle} />
				);
			case 'quote':
				return (
					<FontAwesome
						name="quote-left"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'retweet':
				return (
					<AntDesign
						name="retweet"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'save':
				return (
					<Ionicons
						name={'save-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'server-outline':
				return (
					<Ionicons
						name="server-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'search':
				return (
					<Ionicons
						name="search"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'send':
				return (
					<Ionicons name="send" size={_size} color={_color} style={iconStyle} />
				);
			case 'share':
				return (
					<Ionicons
						name="share-social"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'smiley':
				return (
					<MaterialIcons
						name="add-reaction"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'smiley-outline':
				return (
					<Ionicons
						name={'happy-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'sync-outline':
				return (
					<Ionicons
						name={'sync-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'time-outline':
				return (
					<Ionicons
						name="time-outline"
						size={_size - 1}
						color={_color}
						style={iconStyle}
					/>
				);

			case 'trash':
				return (
					<Ionicons
						name="trash-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);

			case 'to-top':
				return (
					<AntDesign
						name="to-top"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);

			case 'user-guide':
				return (
					<MaterialIcons
						name="notes"
						size={_size}
						color={_color}
						style={[iconStyle, { transform: [{ scaleX: -1 }] }]}
					/>
				);
			case 'wand':
				return (
					<FontAwesome
						name="magic"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'mute-outline':
				return (
					<Ionicons
						name="volume-mute-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'unmute-outline':
				return (
					<Ionicons
						name="volume-high-outline"
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
			case 'warning-outline':
				return (
					<Ionicons
						name={'warning-outline'}
						size={_size}
						color={_color}
						style={iconStyle}
					/>
				);
		}
	}, [id, _size, _color, iconStyle]);

	// Implementation did not seem correct
	// return (
	// 	<View
	// 		style={[{ width: _size, justifyContent: 'center' }, containerStyle]}
	// 	>
	// 		{Icon}
	// 	</View>
	// );
	//
	return onPress ? (
		<Pressable style={[containerStyle]} onPress={onPress}>
			{Icon}
		</Pressable>
	) : (
		<View style={[containerStyle]}>{Icon}</View>
	);
}

type ToggleIconProps = {
	flag: boolean;
	activeIconId: APP_ICON_ENUM;
	inactiveIconId: APP_ICON_ENUM;
	activeTint: string;
	inactiveTint: string;
	size?: number;
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
	count?: number;
};

export function AppToggleIcon({
	flag,
	activeIconId,
	inactiveIconId,
	activeTint,
	inactiveTint,
	size,
	onPress,
	style,
	count,
}: ToggleIconProps) {
	return (
		<View style={[style]}>
			{flag ? (
				<AppIcon
					id={activeIconId}
					color={activeTint}
					size={size}
					onPress={onPress}
				/>
			) : (
				<AppIcon
					id={inactiveIconId}
					color={inactiveTint}
					size={size}
					onPress={onPress}
				/>
			)}
			{/*{count ? (*/}
			{/*	<AppText.Medium*/}
			{/*		style={{ marginLeft: 4, color: flag ? activeTint : inactiveTint }}*/}
			{/*	>*/}
			{/*		{count}*/}
			{/*	</AppText.Medium>*/}
			{/*) : null}*/}
		</View>
	);
}

const styles = StyleSheet.create({
	accountIconTouchableContainer: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	accountIconTouchableContainerRight: {},
	accountIconInternalContainer: {
		borderRadius: 16,
		borderWidth: 0.5,
		borderColor: 'rgba(255, 255, 255, 0.25)',
		marginRight: -2,
	},
});
