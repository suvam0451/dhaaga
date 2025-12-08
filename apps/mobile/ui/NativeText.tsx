import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppTextVariant,
	AppThemingUtil,
} from '#/utils/theming.util';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { StyleProp, TextStyle, Text } from 'react-native';

type Props = {
	color?: string;
	children: any;
	style?: StyleProp<TextStyle>;
	numberOfLines?: number;
	emphasis?: APP_COLOR_PALETTE_EMPHASIS;
	onTextLayout?: (e: any) => void;
	onPress?: () => void;
};

export function NativeTextMedium({
	style,
	color,
	children,
	numberOfLines,
	emphasis,
	onTextLayout,
	onPress,
}: Props) {
	const { theme } = useAppTheme();

	let _color =
		color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);
	let _baseStyling = AppThemingUtil.getBaseStylingForVariant(
		AppTextVariant.BODY_MEDIUM,
	);

	return (
		<Text
			style={[_baseStyling, { color: _color }, style]}
			numberOfLines={numberOfLines}
			onTextLayout={onTextLayout}
			onPress={onPress}
		>
			{children}
		</Text>
	);
}

export function NativeTextSemiBold({
	style,
	color,
	children,
	numberOfLines,
	emphasis,
	onPress,
}: Props) {
	const { theme } = useAppTheme();

	let _color =
		color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

	let _baseStyling = AppThemingUtil.getBaseStylingForVariant(
		AppTextVariant.BODY_SEMIBOLD,
	);

	return (
		<Text
			style={[
				_baseStyling,
				{
					color: _color,
				},
				style,
			]}
			numberOfLines={numberOfLines}
			onPress={onPress}
		>
			{children}
		</Text>
	);
}

export function NativeTextH1({
	style,
	color,
	children,
	numberOfLines,
	emphasis,
	onPress,
}: Props) {
	const { theme } = useAppTheme();

	let _color =
		color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

	let _baseStyling = AppThemingUtil.getBaseStylingForVariant(AppTextVariant.H1);

	return (
		<Text
			style={[
				_baseStyling,
				{
					color: _color,
				},
				style,
			]}
			numberOfLines={numberOfLines}
			onPress={onPress}
		>
			{children}
		</Text>
	);
}

export function NativeTextH6({
	style,
	color,
	children,
	numberOfLines,
	emphasis,
	onPress,
}: Props) {
	const { theme } = useAppTheme();

	let _color =
		color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

	let _baseStyling = AppThemingUtil.getBaseStylingForVariant(AppTextVariant.H6);

	return (
		<Text
			style={[
				_baseStyling,
				{
					color: _color,
				},
				style,
			]}
			numberOfLines={numberOfLines}
			onPress={onPress}
		>
			{children}
		</Text>
	);
}
