import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppTextVariant,
	AppThemingUtil,
} from '#/utils/theming.util';
import { useAppTheme } from '#/states/global/hooks';
import { StyleProp, TextStyle, Text } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { useTranslation } from 'react-i18next';

type Props = {
	color?: string;
	children: any;
	style?: StyleProp<TextStyle>;
	numberOfLines?: number;
	emphasis?: APP_COLOR_PALETTE_EMPHASIS;
	onTextLayout?: (e: any) => void;
	onPress?: () => void;
};

export function NativeTextNormal({
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
		AppTextVariant.BODY_NORMAL,
	);

	return (
		<Text
			style={[_baseStyling, { color: _color }, style]}
			onTextLayout={onTextLayout}
			numberOfLines={numberOfLines}
			onPress={onPress}
		>
			{children}
		</Text>
	);
}

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

/**
 * BABES_NEUE font for the original square aesthetics
 *
 * May break styling for non-english languages
 * @param style
 * @param color
 * @param children
 * @param numberOfLines
 * @param emphasis
 * @param onPress
 * @constructor
 */
export function NativeTextSpecial({
	style,
	color,
	children,
	numberOfLines,
	emphasis,
	onPress,
}: Props) {
	const { theme } = useAppTheme();
	const { i18n } = useTranslation();

	let _color =
		color || AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis);

	let _baseStyling = AppThemingUtil.getBaseStylingForVariant(
		AppTextVariant.SPECIAL,
	);

	const FONT_INCOMPATIBLE = ['jp'].includes(i18n.language);
	return (
		<Text
			style={[
				_baseStyling,
				{
					color: _color,
					fontFamily: FONT_INCOMPATIBLE
						? APP_FONTS.ROBOTO_500
						: APP_FONTS.BEBAS_NEUE_400,
					fontSize: FONT_INCOMPATIBLE ? 18 : 22,
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
