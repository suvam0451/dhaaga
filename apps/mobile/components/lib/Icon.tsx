import { memo, useMemo } from 'react';
import {
	Platform,
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

export type APP_ICON_ENUM =
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
	| 'chevron-right'
	| 'chevron-down'
	| 'checkmark-done-outline'
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
	| 'heart'
	| 'home'
	| 'info'
	| 'language'
	| 'layers-outline'
	| 'lock-closed-outline'
	| 'menu'
	| 'message'
	| 'more-options-vertical'
	| 'newspaper'
	| 'no-account'
	| 'palette'
	| 'phonebook'
	| 'pin'
	| 'pin-octicons'
	| 'retweet'
	| 'save'
	| 'search'
	| 'share'
	| 'feelings'
	| 'smiley'
	| 'to-top'
	| 'trash'
	| 'user-guide'
	| 'wand'
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
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

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
				case 'add-circle-outline':
					return (
						<Ionicons
							name={'add-circle-outline'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'albums-outline':
					return (
						<Ionicons
							name={'albums-outline'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'bell':
					return (
						<Ionicons
							name="notifications"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'back':
					return (
						<Ionicons
							name="chevron-back"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'bookmark':
					return (
						<Ionicons
							name="bookmark"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'bookmark-outline':
					return (
						<Ionicons
							name="bookmark-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'block':
					return (
						<Ionicons
							id={'ban-outline'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'browser':
					return (
						<Ionicons
							name="browsers-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'chatbox-outline':
					return (
						<Ionicons
							name={'chatbox-outline'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'chat-ellipses-outline':
					return (
						<Ionicons
							name={'chatbox-ellipses-outline'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'checkmark-circle':
					return (
						<Ionicons
							name={'checkmark-circle'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'chevron-right':
					return (
						<Entypo
							name="chevron-small-right"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'chevron-down':
					return (
						<Ionicons
							name="chevron-down"
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'checkmark-done-outline':
					return (
						<Ionicons
							name="checkmark-done-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);

				case 'cog':
					return Platform.OS === 'ios' ? (
						<Ionicons
							name="cog"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					) : (
						<FontAwesome5
							name="cog"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'copy':
					return (
						<Ionicons
							name="copy-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'clear':
					return (
						<AntDesign
							name="close"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'create':
					return (
						<Ionicons
							name="create-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'done':
					return (
						<Ionicons
							name="checkmark-done"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'edit':
					return (
						<Feather
							name="edit"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);

				case 'ellipsis-v':
					return (
						<Ionicons
							name="ellipsis-horizontal"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'external-link':
					return (
						<Feather
							name="external-link"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'eye':
					return (
						<Ionicons
							name="eye-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'eye-filled':
					return (
						<Ionicons
							name="eye-filled"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'eye-off-filled':
					return (
						<Ionicons
							name="eye-off-filled"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'gallery':
					return (
						<Ionicons
							name="logo-instagram"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'heart':
					return (
						<Ionicons
							name={'heart-outline'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'home':
					return (
						<Ionicons
							name="home"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'info':
					return (
						<Ionicons
							name="information-circle-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'language':
					return (
						<Ionicons
							name="language"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'layers-outline':
					return (
						<Ionicons
							name={'layers-outline'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'lock-closed-outline':
					return (
						<Ionicons
							name="lock-closed-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'feelings':
					return (
						<FontAwesome6
							name="heart-pulse"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'menu':
					return (
						<Ionicons
							name="menu"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'message':
					return (
						<AntDesign
							name="message1"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'more-options-vertical':
					return (
						<Ionicons
							name={'ellipsis-vertical'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'newspaper':
					return (
						<Ionicons
							name={'newspaper-outline'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'no-account':
					return (
						<MaterialIcons
							name="no-accounts"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'palette':
					return (
						<Ionicons
							name="color-palette-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'phonebook':
					return (
						<FontAwesome6
							name="contact-book"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'pin':
					return (
						<AntDesign
							name="pushpino"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'pin-octicons':
					return (
						<Octicons
							name="pin"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'retweet':
					return (
						<AntDesign
							name="retweet"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'save':
					return (
						<Ionicons
							name={'save-outline'}
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'search':
					return (
						<AntDesign
							name="search1"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'share':
					return (
						<Ionicons
							name="share-social"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'smiley':
					return (
						<MaterialIcons
							name="add-reaction"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'trash':
					return (
						<FontAwesome
							name="trash-o"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);

				case 'to-top':
					return (
						<AntDesign
							name="totop"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);

				case 'user-guide':
					return (
						<MaterialIcons
							name="notes"
							size={_size}
							color={_color}
							onPress={onPress}
							style={[iconStyle, { transform: [{ scaleX: -1 }] }]}
						/>
					);
				case 'wand':
					return (
						<FontAwesome
							name="magic"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'mute-outline':
					return (
						<Ionicons
							name="volume-mute-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
				case 'unmute-outline':
					return (
						<Ionicons
							name="volume-high-outline"
							size={_size}
							color={_color}
							onPress={onPress}
							style={iconStyle}
						/>
					);
			}
		}, [id, _size, _color, iconStyle]);

		return (
			<View
				style={[{ width: _size, justifyContent: 'center' }, containerStyle]}
			>
				{Icon}
			</View>
		);
	},
);

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
