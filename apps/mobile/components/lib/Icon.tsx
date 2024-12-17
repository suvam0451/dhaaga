import { memo, useMemo } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
	Platform,
	StyleProp,
	StyleSheet,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { TimelineFetchMode } from '../common/timeline/utils/timeline.types';
import * as Haptics from 'expo-haptics';
import { APP_FONT } from '../../styles/AppTheme';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../styles/AppFonts';

export type APP_ICON_ENUM =
	| 'bell'
	| 'back'
	| 'chevron-right'
	| 'checkmark-done-outline'
	| 'cog'
	| 'create'
	| 'clear'
	| 'done'
	| 'edit'
	| 'ellipsis-v'
	| 'external-link'
	| 'home'
	| 'info'
	| 'menu'
	| 'message'
	| 'no-account'
	| 'palette'
	| 'phonebook'
	| 'retweet'
	| 'search'
	| 'share'
	| 'feelings'
	| 'smiley'
	| 'trash'
	| 'user-guide'
	| 'wand';

type AppIconType = {
	id: APP_ICON_ENUM;
	emphasis?: 'high' | 'low' | 'medium' | 'c';
	iconStyle?: StyleProp<TextStyle>;
	containerStyle?: StyleProp<ViewStyle>;
	size?: number;
	onPress?: () => void;
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
	const { setType } = useGlobalState(
		useShallow((o) => ({
			setType: o.setHomepageType,
		})),
	);

	function onPress() {
		router.navigate('/');
	}

	function onLongPress() {
		setType(TimelineFetchMode.IDLE);
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
		show(APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT);
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
	({ id, emphasis, iconStyle, size, onPress, containerStyle }: AppIconType) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		let _color = null;
		let _size = size || 24;
		switch (emphasis) {
			case 'high': {
				_color = theme.textColor.high;
				break;
			}
			case 'medium': {
				_color = theme.textColor.medium;
				break;
			}
			case 'low': {
				_color = theme.textColor.low;
				break;
			}
			case 'c': {
				_color = theme.textColor.emphasisC;
				break;
			}
			default: {
				_color = theme.textColor.medium;
				break;
			}
		}

		const Icon = useMemo(() => {
			switch (id) {
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
	subHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'blue',
	},
	navbarTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	navbarTitle: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
	buttonContainer: {
		height: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 10,
	},
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
