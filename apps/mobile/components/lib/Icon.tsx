import { memo, useMemo } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAppTheme } from '../../hooks/app/useAppThemePack';
import { StyleProp, TextStyle, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome } from '@expo/vector-icons';

export type APP_ICON_ENUM =
	| 'create'
	| 'clear'
	| 'done'
	| 'edit'
	| 'menu'
	| 'palette'
	| 'search'
	| 'feelings'
	| 'trash';

type AppIconType = {
	id: APP_ICON_ENUM;
	emphasis?: 'high' | 'low' | 'medium';
	iconStyle?: StyleProp<TextStyle>;
	containerStyle?: StyleProp<TextStyle>;
	size?: number;
	onPress?: () => void;
};

export const AppIcon = memo(
	({ id, emphasis, iconStyle, size, onPress, containerStyle }: AppIconType) => {
		const { colorScheme } = useAppTheme();
		let _color = null;
		let _size = size || 24;
		switch (emphasis) {
			case 'high': {
				_color = colorScheme.textColor.high;
				break;
			}
			case 'medium': {
				_color = colorScheme.textColor.medium;
				break;
			}
			case 'low': {
				_color = colorScheme.textColor.low;
				break;
			}
			default: {
				_color = colorScheme.textColor.medium;
				break;
			}
		}

		const Icon = useMemo(() => {
			switch (id) {
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
