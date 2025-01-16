import { memo, useMemo } from 'react';
import {
	Platform,
	Pressable,
	StyleProp,
	StyleSheet,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import { APP_BOTTOM_SHEET_ENUM } from '../dhaaga-bottom-sheet/Core';
// icons packs
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';

export type APP_ICON_ENUM =
	| 'add'
	| 'add-circle-outline'
	| 'albums-outline'
	| 'bell'
	| 'back'
	| 'bookmark'
	| 'bookmark-outline'
	| 'block'
	| 'browser'
	| 'chatbox-outline'
	| 'chat-ellipses-outline'
	| 'checkmark-circle'
	| 'checkmark-done-outline'
	| 'chevron-left'
	| 'chevron-right'
	| 'chevron-down'
	| 'chevron-down-circle'
	| 'cloud-upload-outline'
	| 'close-outline'
	| 'cog'
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
	| 'gallery'
	| 'globe'
	| 'heart'
	| 'heart-outline'
	| 'home'
	| 'images'
	| 'info'
	| 'language'
	| 'layers-outline'
	| 'list'
	| 'lock-closed-outline'
	| 'menu'
	| 'message'
	| 'more-options-vertical'
	| 'musical-notes-outline'
	| 'newspaper'
	| 'no-account'
	| 'palette'
	| 'people'
	| 'phonebook'
	| 'pin'
	| 'pin-octicons'
	| 'retweet'
	| 'save'
	| 'search'
	| 'send'
	| 'share'
	| 'feelings'
	| 'smiley'
	| 'smiley-outline'
	| 'sync-outline'
	| 'to-top'
	| 'trash'
	| 'user-guide'
	| 'wand'
	| 'warning-outline'
	| 'mute-outline'
	| 'unmute-outline';

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
}: NavigationIconType) {
	function onPress() {
		router.navigate('/');
	}

	function onLongPress() {
		router.navigate('/');
	}

	return (
		<TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
			{focused ? (
				<Ionicons size={size + 2} name="home" color={color} />
			) : (
				<Ionicons size={size + 2} name="home-outline" color={color} />
			)}
		</TouchableOpacity>
	);
}

export function ProfileTabNavbarIcon({ color, size }: NavigationIconType) {
	const { acct, show, theme, isAnimating, visible } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			show: o.bottomSheet.show,
			setType: o.bottomSheet.setType,
			theme: o.colorScheme,
			visible: o.bottomSheet.visible,
			isAnimating: o.bottomSheet.isAnimating,
		})),
	);

	function onLongPress() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		show(APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT, true);
	}

	function onPress() {
		router.navigate('/profile');
	}

	if (visible && isAnimating) return <View />;
	if (!acct)
		return (
			<TouchableOpacity
				style={styles.accountIconTouchableContainerRight}
				onPress={onPress}
				onLongPress={onLongPress}
			>
				<MaterialIcons name="no-accounts" size={size + 4} color={color} />
			</TouchableOpacity>
		);

	return (
		<View style={{ flexDirection: 'row', flex: 1 }}>
			<TouchableOpacity
				style={styles.accountIconTouchableContainer}
				onPress={onPress}
				onLongPress={onLongPress}
			>
				<View style={styles.accountIconInternalContainer}>
					{/*@ts-ignore-next-line*/}
					<Image
						style={{
							width: 36,
							height: 36,
							opacity: 0.87,
							borderRadius: 8,
						}}
						source={{ uri: acct?.avatarUrl }}
						contentFit="fill"
					/>
				</View>
				<View style={{ width: 14 }}>
					<Feather name="more-vertical" size={24} color={theme.textColor.low} />
				</View>
			</TouchableOpacity>
		</View>
	);
}

export function DiscoverNavigationIcon(props: NavigationIconType) {}

export const AppIcon = memo(
	({
		id,
		emphasis,
		iconStyle,
		size,
		onPress,
		containerStyle,
		color,
	}: AppIconType) => {
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
				case 'cloud-upload-outline':
					return (
						<Ionicons
							name={'cloud-upload-outline'}
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
				case 'cog':
					return Platform.OS === 'ios' ? (
						<Ionicons
							name="cog"
							size={_size}
							color={_color}
							style={iconStyle}
						/>
					) : (
						<FontAwesome5
							name="cog"
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
						<AntDesign
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
						<Feather
							name="edit"
							size={_size}
							color={_color}
							style={iconStyle}
						/>
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
						<Ionicons
							name="eye"
							size={_size}
							color={_color}
							style={iconStyle}
						/>
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
						<Feather
							name="globe"
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
						<Ionicons
							name="home"
							size={_size}
							color={_color}
							style={iconStyle}
						/>
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
				case 'menu':
					return (
						<Ionicons
							name="menu"
							size={_size}
							color={_color}
							style={iconStyle}
						/>
					);
				case 'message':
					return (
						<AntDesign
							name="message1"
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
				case 'palette':
					return (
						<Ionicons
							name="color-palette-outline"
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
							name="pushpino"
							size={_size}
							color={_color}
							style={iconStyle}
						/>
					);
				case 'pin-octicons':
					return (
						<Octicons
							name="pin"
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
				case 'search':
					return (
						<AntDesign
							name="search1"
							size={_size}
							color={_color}
							style={iconStyle}
						/>
					);
				case 'send':
					return (
						<Ionicons
							name="send"
							size={_size}
							color={_color}
							style={iconStyle}
						/>
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
							name="totop"
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
		return (
			<Pressable style={[containerStyle]} onPress={onPress}>
				{Icon}
			</Pressable>
		);
	},
);

type ToggleIconProps = {
	flag: boolean;
	activeIconId: APP_ICON_ENUM;
	inactiveIconId: APP_ICON_ENUM;
	activeTint: string;
	inactiveTint: string;
	size?: number;
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
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
}: ToggleIconProps) {
	return (
		<View style={style}>
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
		</View>
	);
}

const styles = StyleSheet.create({
	accountIconTouchableContainer: {
		height: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		paddingTop: 12,
	},
	accountIconTouchableContainerRight: {
		height: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 10,
	},
	accountIconInternalContainer: {
		borderRadius: 8,
		borderWidth: 0.5,
		borderColor: 'rgba(255, 255, 255, 0.25)',
	},
});
